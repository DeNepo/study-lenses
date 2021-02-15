"use strict";

import { config } from "../data/config.js";
import { state } from "../data/state.js";
import { print } from "../lib/print.js";
import { aran } from "../setup.js";

import { isNative } from "../lib/is-native.js";

const nativeConsole = console;
const nativeInteractions = [prompt, alert, confirm];

export default {
  apply(f, t, xs, serial) {
    state.inNativeCallstack = isNative(f);

    // account for native methods
    const node = aran.nodes[serial];
    // console.log(node);
    const line = node.loc.start.line;

    const commaSeparatedArgs = [];
    for (const arg of xs) {
      commaSeparatedArgs.push(arg);
      commaSeparatedArgs.push(",");
    }
    commaSeparatedArgs.pop();

    const isNativeInteraction = nativeInteractions.includes(f);
    // eventually do the same thing for dom
    const calledConsoleMethod = Object.values(nativeConsole).includes(f);
    if (calledConsoleMethod && config.console) {
      print({
        prefix: line,
        logs: [`console.${f ? f.name : f}(`, ...commaSeparatedArgs, ")"],
      });
    } else if (
      !state.inNativeCallstack ||
      (isNativeInteraction && config.interactions)
    ) {
      print({
        prefix: line,
        // logs: ["call: " + f.name + "(", ...commaSeparatedArgs, ")"],
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

    state.scopes.push({
      type: "lexical",
      name: f ? f.name : f,
    });
    if (!calledConsoleMethod) {
      x = Reflect.apply(f, t, xs);
    }
    state.scopes.pop();

    if (isNativeInteraction && config.interactions) {
      print({
        logs: ["%c (return value):", "font-weight: bold;", x],
      });
    }
    if (
      !state.inNativeCallstack ||
      (isNativeInteraction && config.interactions)
    ) {
      console.groupEnd();
    }

    state.inNativeCallstack = !isNative(f);

    return x;
  },
  return: (value, serial) => {
    // return META.return($x, @serial);
    // debugger;
    // account for native methods
    const node = aran.nodes[serial];
    // console.log(node);
    const line = node.loc.start.line;
    if (!state.inNativeCallstack) {
      print({
        prefix: (prefixify) => prefixify(line) + " (return value):",
        logs: [value],
        style: "font-weight: bold;",
      });
    }

    return value;
  },
};
