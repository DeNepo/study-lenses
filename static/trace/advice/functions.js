"use strict";

import { config } from "../data/config.js";
import { state } from "../data/state.js";
import { print } from "../lib/trace-log.js";

import { isNative } from "../lib/is-native.js";
import { isInRange } from "../lib/is-in-range.js";

export default {
  apply(f, t, xs, serial) {
    if (!f) {
      // throw the error right away for failure advice to catch
      //  without doing any apply logging
      f();
    }

    const functionName = f.name || "anonymous";

    state.node = state.aran.nodes[serial];
    const line = state.node.loc.start.line;
    const col = state.node.loc.start.column;

    const commaSeparatedArgs = [];
    for (const arg of xs) {
      commaSeparatedArgs.push(arg);
      commaSeparatedArgs.push(",");
    }
    commaSeparatedArgs.pop();

    const nodeIsInRange = isInRange(state.node);

    // priority to console trace configuration
    const isConsoleCall = Object.values(console).includes(f) || t === console;
    if (isConsoleCall) {
      if (!nodeIsInRange) {
      } else if (config.console) {
        print({
          prefix: [line, col],
          logs: [
            ` console.${f ? functionName : f}(`,
            ...commaSeparatedArgs,
            ")",
          ],
        });
      }
      return;
    }

    if (f.name === "get" && xs[0] === console && xs[2] === console) {
      // because of iframing the instrumentation
      return Reflect.apply(f, t, xs);
    }

    // console.log(3);

    // in case only console & not functions
    if (!config.functions || !nodeIsInRange) {
      console.log(3.5);
      return Reflect.apply(f, t, xs);
    }

    // account for Aran implementation
    //  remove when upgrading to new Aran
    else if (f === Reflect.get || f === Object) {
      if (state.node.callee.type === "MemberExpression") {
        // let errors be handled by failure
        return Reflect.apply(f, t, xs);
      }
    }

    // console.log(5);

    // tracing selected functions
    if (
      config.functionsList.length !== 0 &&
      // !config.functionsList.find((query) => new RegExp(query).test(functionName))
      !config.functionsList.includes(functionName)
    ) {
      state.scopes.push(null);
      const result = Reflect.apply(f, t, xs);
      state.scopes.pop();
      return result;
    }

    // console.log(6);

    print({
      prefix: [line, col],
      logs: [functionName + " (function call):", ...commaSeparatedArgs],
      out: console.groupCollapsed,
    });
    if (config.this) {
      print({
        logs: ["%cthis:", "font-weight: bold;", t],
      });
    }

    // console.log(7);
    state.scopes.push(null);
    const x = Reflect.apply(f, t, xs);
    state.scopes.pop();

    print({
      prefix: "(return value):",
      logs: [x],
      style: "font-weight: bold;",
    });
    console.groupEnd();

    return x;
  },

  // closure: (f, serial) => {
  //   const g = function (...xs) {
  //     return Reflect.apply(f, this, Array.from(arguments));
  //   };
  //   Reflect.defineProperty(g, "name", {
  //     __proto__: null,
  //     value: functionName,
  //   });
  //   Reflect.defineProperty(g, "length", {
  //     __proto__: null,
  //     value: f.length,
  //   });
  //   return g;
  // },

  // // no good for this, will miss implicit returns. and can't tell if there was an explicti or no
  // return: (value, serial) => {
  //   // return META.return($x, @serial);
  //   // debugger;
  //   // account for native methods
  //   state.node = state.aran.nodes[serial];
  //   // console.log(state.node);
  //   const line = state.node.loc.start.line;
  //   if (!state.inNativeCallstack) {
  //     print({
  //       prefix: (prefixify) => prefixify(line) + " (return value):",
  //       logs: [value],
  //       style: "font-weight: bold;",
  //     });
  //   }

  //   return value;
  // },
};
