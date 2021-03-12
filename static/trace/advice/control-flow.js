"use strict";

import { config } from "../data/config.js";
import { state } from "../data/state.js";
import { isInRange } from "../lib/is-in-range.js";
import { print } from "../lib/trace-log.js";
import { aran } from "../setup.js";

const breakOrContinue = (type) => (label, serial) => {
  const node = aran.nodes[serial];
  if (!isInRange(node)) {
    return;
  }

  // console.log(node);
  const line = node.test ? node.test.loc.start.line : node.loc.start.line;
  const col = node.test ? node.test.loc.start.column : node.loc.start.column;

  print({
    prefix: (linePrefix) =>
      linePrefix(line, col) + " " + type + " " + (label || ""),
    style: "font-weight: bold;",
  });
};

export default {
  test: (consumed, serial) => {
    const node = aran.nodes[serial];
    if (!isInRange(node)) {
      return consumed;
    }

    const line = node.test ? node.test.loc.start.line : node.loc.start.line;
    const col = node.test ? node.test.loc.start.column : node.loc.start.column;

    if (node.type === "LogicalExpression") {
      const lineOfCode = state.code.split("\n")[line - 1];

      const truthiness = consumed ? "truthy" : "falsy";
      print({
        prefix: [line, col],
        logs: ["operator (" + node.operator + ", " + truthiness + ")"],
        out: console.groupCollapsed,
      });
      // print({ logs: ["(evaluates to):", consumed] });
      console.groupEnd();
      return consumed;
    }

    let controlName = "";
    if (node.type === "ConditionalExpression") {
      controlName = "ternary";
    } else if (node.type === "IfStatement") {
      controlName = "if";
    } else if (node.type === "SwitchCase") {
      controlName = "case";
    } else if (node.type === "WhileStatement") {
      controlName = "while";
    } else if (node.type === "DoWhileStatement") {
      controlName = "do while";
    } else if (node.type === "ForStatement") {
      controlName = "for";
    } else if (node.type === "ForOfStatement") {
      controlName = "for of";
    } else if (node.type === "ForInStatement") {
      controlName = "for in";
    }

    const lineOfCode = state.code.split("\n")[line - 1];

    const truthiness = consumed ? "truthy" : "falsy";
    print({
      prefix: [line, col],
      logs: ["test (" + controlName + ", " + truthiness + "):", consumed],
      out: console.groupCollapsed,
    });
    print({ prefix: "", logs: [lineOfCode] });
    console.groupEnd();
    // }
    // console.log(node);
    return consumed;
  },
  break: breakOrContinue("break"),
  continue: breakOrContinue("continue"),
};
