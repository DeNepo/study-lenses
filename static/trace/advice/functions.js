import { config } from "../data/config.js";
import { state } from "../data/state.js";
import { print } from "../lib/trace-log.js";

import { isNative } from "../lib/is-native.js";
import { isInRange } from "../lib/is-in-range.js";

export default {
  apply(f, t, xs, serial) {
    if (typeof f !== "function") {
      // throw the error right away for failure advice to catch
      //  without doing any apply logging
      f();
    }

    // hack, because of instrumentation
    if (
      f.name === "Object" &&
      f !== Object &&
      xs.length === 1 &&
      xs[0] &&
      xs[0].name === "Object"
    ) {
      return Reflect.apply(f, t, xs);
    }
    // console.log(1);

    const functionName = f.name || "anonymous";

    state.node = state.aran.nodes[serial];
    const line = state.node.loc.start.line;
    const col = state.node.loc.start.column;

    // console.log(f, t, xs, serial, state.aran.nodes[serial]);
    // don't trace implicit object coercion of primitives
    if (
      state.node.callee &&
      state.node.callee.object &&
      (state.node.callee.object.type === "Literal" || t === undefined) &&
      f.name === "Object"
    ) {
      return Reflect.apply(f, t, xs);
    }

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
      return undefined;
    }
    // console.log(2);

    // because of instrumentation
    // if (f.name === "get" && xs[0] === console && xs[2] === console) {

    const firstAndThirdAreSame =
      (xs[0] ? xs[0].toString() : xs[0]) === (xs[2] ? xs[2].toString() : xs[2]);
    if (f.name === "get" && xs.length === 3 && firstAndThirdAreSame) {
      return Reflect.apply(f, t, xs);
    }

    // console.log(3);

    // in case only console & not functions
    if (!config.functions || !nodeIsInRange) {
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

    // console.log(4);

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

    // console.log(5);

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
