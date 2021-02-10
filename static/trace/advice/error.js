"use strict";

import { config } from "../data/config.js";
import { state } from "../data/state.js";
import { print } from "../lib/print.js";
import { aran } from "../setup.js";

export default {
  failure: (value, serial) => {
    // account for native methods
    const node = aran.nodes[serial];
    // console.log(node);
    const line = node.loc.start.line;
    print({
      prefix: line,
      logs: [value.name + ": " + value.message],
    });
    return x;
  },
};
