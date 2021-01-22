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
      print({
        prefix: line,
        logs: ["calling the function named ", f.name],
      });
      print({
        prefix: (prefy) => " " + Array(prefy(line).length).join(" "),
        logs: ["args:", xs],
      });
      if (config.this) {
        print({
          prefix: (prefy) => " " + Array(prefy(line).length).join(" "),
          logs: [
            "this:",
            typeof t === "function" ? "a function named " + t.name : t,
          ],
        });
      }
    }
    state.scopeDepth += 1;
    const x = Reflect.apply(f, t, xs);
    state.scopeDepth -= 1;
    if (config.functions) {
      print({
        prefix: line,
        logs: [
          f.name + " returning:",
          typeof x === "function" ? "a function named " + x.name : x,
        ],
      });
    }
    return x;
  },
};
