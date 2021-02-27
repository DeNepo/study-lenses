"use strict";

import { config } from "../data/config.js";
import { state } from "../data/state.js";
import { print } from "../lib/print.js";
import { aran } from "../setup.js";

export default {
  unary: (operator, value, serial) => {
    // META.unary("!", $x, @serial)
    const result = aran.unary(operator, value);
    if (!state.inNativeCallstack) {
      const node = aran.nodes[serial];
      const line = node.loc.start.line;
      const col = node.loc.start.column;
      print({
        prefix: [line, col],
        logs: [operator, value],
        style: "font-weight: bold;",
        out: console.groupCollapsed,
      });
      print({ logs: ["(evaluates to):", result] });
      console.groupEnd();
    }
    // console.log(node);
    return result;
  },
  binary: (operator, left, right, serial) => {
    // META.binary("+", $x, $y, @serial)
    const result = aran.binary(operator, left, right);
    if (!state.inNativeCallstack) {
      const node = aran.nodes[serial];
      const line = node.loc.start.line;
      const col = node.loc.start.column;
      print({
        prefix: [line, col],
        logs: [left, operator, right],
        style: "font-weight: bold;",
        out: console.groupCollapsed,
      });
      print({ logs: ["(evaluates to):", result] });
      console.groupEnd();
    }
    // console.log(node);
    return result;
  },
};
