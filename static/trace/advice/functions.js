"use strict";

import { config } from "../data/config.js";
import { state } from "../data/state.js";
import { print } from "../lib/print.js";
import { aran } from "../setup.js";

import { isNative } from "../lib/is-native.js";

const nativeConsole = console;

export default {
  apply(f, t, xs, serial) {
    const isNativeFunction = isNative(f);
    const isNativeGetter = isNativeFunction && f.name === "get";

    const isConsoleCall =
      (isNativeFunction && Object.values(nativeConsole).includes(f)) ||
      t === nativeConsole;

    const node = aran.nodes[serial];
    // remove when upgrading to new Aran
    if (f === Reflect.get || f === Object) {
      if (node.callee.type === "MemberExpression") {
        if (!isConsoleCall) {
          // let errors be handled by failure
          return Reflect.apply(f, t, xs);
        }
      }
    }

    const line = node.loc.start.line;
    const col = node.loc.start.column;

    const commaSeparatedArgs = [];
    for (const arg of xs) {
      commaSeparatedArgs.push(arg);
      commaSeparatedArgs.push(",");
    }
    commaSeparatedArgs.pop();

    const traceConsole = config.console && isConsoleCall;
    const traceNative =
      config.functionsNative && isNativeFunction && !isConsoleCall;
    // &&
    // !state.inNativeCallstack;
    const traceDefined = config.functionsDefined && !isNativeFunction;

    if (isNativeGetter) {
    } else if (traceConsole) {
      // console.group("console");
      // console.log(isConsoleCall, t, f);
      // console.groupEnd();
      print({
        prefix: [line, col],
        logs: [`console.${f ? f.name : f}(`, ...commaSeparatedArgs, ")"],
      });
    } else if (traceNative) {
      // console.group("native");
      // console.log(isConsoleCall, t, f);
      // console.groupEnd();
      print({
        prefix: [line, col],
        logs: [f.name + " (function call):", ...commaSeparatedArgs],
        out: console.groupCollapsed,
      });
    } else if (traceDefined) {
      // console.group("defined");
      // console.log(isConsoleCall, t, f);
      // console.groupEnd();
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
    }

    let x = undefined;
    if (!isConsoleCall) {
      // let errors be handled by failure
      x = Reflect.apply(f, t, xs);
    }

    // if (isNativeFunction && isNative(x)) {
    //   return x;
    // }

    if (isNativeGetter) {
    } else if (traceConsole) {
      // console.group("console");
      // console.log(isConsoleCall, t, f);
      // console.groupEnd();
    } else if (traceNative) {
      // console.group("native");
      // console.log(isConsoleCall, t, f);
      // console.groupEnd();
      print({
        prefix: "(return value):",
        logs: [x],
        style: "font-weight: bold;",
      });
      console.groupEnd();
    } else if (traceDefined) {
      // console.group("defined");
      // console.log(isConsoleCall, t, f);
      // console.groupEnd();
      print({
        prefix: "(return value):",
        logs: [x],
        style: "font-weight: bold;",
      });
      console.groupEnd();
    }

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
