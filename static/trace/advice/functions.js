"use strict";

import { config } from "../data/config.js";
import { state } from "../data/state.js";
import { print } from "../lib/trace-log.js";
import { aran } from "../setup.js";

import { isNative } from "../lib/is-native.js";
import { isInRange } from "../lib/is-in-range.js";

const nativeConsole = console;

export default {
  apply(f, t, xs, serial) {
    const node = aran.nodes[serial];
    const line = node.loc.start.line;
    const col = node.loc.start.column;

    const commaSeparatedArgs = [];
    for (const arg of xs) {
      commaSeparatedArgs.push(arg);
      commaSeparatedArgs.push(",");
    }
    commaSeparatedArgs.pop();

    const nodeIsInRange = isInRange(node);

    // priority to console trace configuration
    const isConsoleCall =
      Object.values(nativeConsole).includes(f) || t === nativeConsole;
    if (isConsoleCall) {
      if (!nodeIsInRange) {
      } else if (config.console) {
        print({
          prefix: [line, col],
          logs: [` console.${f ? f.name : f}(`, ...commaSeparatedArgs, ")"],
        });
      }
      return;
    }

    // in case only console & not functions
    if (!config.functions || !nodeIsInRange) {
      return Reflect.apply(f, t, xs);
    }

    // account for Aran implementation
    //  remove when upgrading to new Aran
    else if (f === Reflect.get || f === Object) {
      if (node.callee.type === "MemberExpression") {
        // let errors be handled by failure
        return Reflect.apply(f, t, xs);
      }
    }

    // tracing selected functions
    if (
      config.functionsList.length !== 0 &&
      !config.functionsList.find((query) => new RegExp(query).test(f.name))
    ) {
      return Reflect.apply(f, t, xs);
    }

    print({
      prefix: [line, col],
      logs: [f.name + " (function call):", ...commaSeparatedArgs],
      out: console.groupCollapsed,
    });
    if (config.this) {
      print({
        logs: ["%cthis:", "font-weight: bold;", t],
      });
    }

    let x = undefined;
    x = Reflect.apply(f, t, xs);

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
  //     value: f.name,
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
  //   const node = aran.nodes[serial];
  //   // console.log(node);
  //   const line = node.loc.start.line;
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
