"use strict";

import { config } from "../data/config.js";
import { state } from "../data/state.js";
import { print } from "../lib/print.js";
import { aran } from "../setup.js";

const breakOrContinue = (type) => (label, serial) => {
  const node = aran.nodes[serial];
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
    // console.log(state.inNativeCallstack);
    // if (!state.inNativeCallstack) {
    const node = aran.nodes[serial];
    // console.log(node);
    const line = node.test ? node.test.loc.start.line : node.loc.start.line;
    const col = node.test ? node.test.loc.start.column : node.loc.start.column;

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
