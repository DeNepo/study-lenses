"use strict";

import { config } from "../data/config.js";
import { state } from "../data/state.js";
import { print } from "../lib/print.js";
import { aran } from "../setup.js";

export default {
  apply: (f, t, xs, serial) => {
    // account for native methods
    const node = aran.nodes[serial];
    // console.log(node);
    const line = node.loc.start.line;

    if (config.functions) {
      const printableArgsArray = [];
      for (const arg of xs) {
        printableArgsArray.push(arg, ",");
      }
      printableArgsArray.pop();
      print({
        prefix: line,
        logs: [f.name + "(", ...printableArgsArray, ")"],
      });
    }
    if (config.this) {
      print({
        prefix: Array(prefix.length).join(" "),
        logs: [" this: ", t],
      });
    }
    state.scopeDepth += 1;
    const x = Reflect.apply(f, t, xs);
    state.scopeDepth -= 1;
    if (config.functions) {
      print({ prefix: line, logs: [x + "\n"] });
    }
    return x;
  },
};
