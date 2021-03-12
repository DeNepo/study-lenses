"use strict";

import { config } from "../data/config.js";
import { state } from "../data/state.js";
import { isInRange } from "../lib/is-in-range.js";
import { print } from "../lib/trace-log.js";
import { aran } from "../setup.js";

export default {
  unary: (operator, value, serial) => {
    const result = aran.unary(operator, value);

    const node = aran.nodes[serial];
    if (!isInRange(node)) {
      return result;
    }

    // META.unary("!", $x, @serial)

    if (
      config.operatorsList.length !== 0 &&
      !config.operatorsList.includes(operator)
    ) {
      return result;
    }

    if (!state.inNativeCallstack) {
      const line = node.loc.start.line;
      const col = node.loc.start.column;
      print({
        prefix: [line, col],
        logs: ["operation (" + operator + "):", operator, value],
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
    const result = aran.binary(operator, left, right);
    // META.binary("+", $x, $y, @serial)
    const node = aran.nodes[serial];
    if (!isInRange(node)) {
      return result;
    }

    if (
      config.operatorsList.length !== 0 &&
      !config.operatorsList.includes(operator)
    ) {
      return result;
    }

    if (!state.inNativeCallstack) {
      const line = node.loc.start.line;
      const col = node.loc.start.column;
      print({
        prefix: [line, col],
        logs: ["operation (" + operator + "):", left, operator, right],
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
