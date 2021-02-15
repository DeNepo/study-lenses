"use strict";

import { config } from "../data/config.js";
import { state } from "../data/state.js";
import { print } from "../lib/print.js";
import { aran } from "../setup.js";

export default {
  failure: (value, serial) => {
    console.log(value);
    // still figuring out aran errors
    console.log(
      "%c" + (value ? value.name : "failure"),
      "color:red;",
      " run or debug code for a complete error message"
    );
    // console.log(value);
    // account for native methods
    // const node = aran.nodes[serial];
    // console.log(node);
    // const line = node.loc.start.line;
    // print({
    //   // prefix: line,
    //   logs: [
    //     value.name,
    //     // value.name + ": " + value.message,
    //     // "\n",
    //     // `https://duckduckgo.com/?q=javascript+${
    //     //   value.name
    //     // }+${value.message.replaceAll(" ", "+")}`,
    //   ],
    // });
    return value;
  },
};
