"use strict";

import { config } from "../data/config.js";
import { state } from "../data/state.js";
import { print } from "../lib/print.js";
import { aran } from "../setup.js";

export default {
  enter: (tag, labels, variables, serial) => {
    if (!config.blocks) {
      return;
    }
    const node = aran.nodes[serial];
    // console.log(node);
    const line = node.loc.start.line;
    print({
      prefix: line,
      logs: ["BEGIN BLOCK" + (labels[0] ? `: ${labels[0]}` : "")],
    });
    if (labels[0]) {
      state.blockLabels.push(labels[0]);
    }

    state.scopeDepth += 1;

    // console.log(state.scopeDepth);
    // console.log(tag, labels, variables, serial);
  },
  leave: (serial) => {
    // leave trap is not triggered if returning from a block

    if (!config.blocks) {
      return;
    }

    state.scopeDepth -= 1;
    const node = aran.nodes[serial];
    // console.log(node);
    const line = node.loc.end.line;

    if (state.blockLabels.length !== 0) {
      const block = state.blockLabels.pop();
      print({ prefix: line, logs: ["END BLOCK: " + block] });
    } else {
      print({ prefix: line, logs: ["END BLOCK"] });
    }
  },
  read: (value, variable, serial) => {
    if (!config.variables) {
      return value;
    }
    // because aran encodes generated variables as number strings
    if (!isNaN(variable)) {
      return value;
    }
    const node = aran.nodes[serial];
    const line = node.loc.start.line;
    print({
      prefix: line,
      logs: [
        "read from " + (node.left ? node.left.name : variable) + ": ",
        typeof value === "function" ? "a function named " + value.name : value,
      ],
    });
    // console.log("value:", value);
    // console.log("variable:", variable);
    // console.log("serial:", serial);
    // console.log("node:", node);
    return value;
  },
  write: (value, variable, serial) => {
    if (!config.variables) {
      return value;
    }
    // because aran encodes generated variables as number strings
    if (!isNaN(variable)) {
      return value;
    }
    const node = aran.nodes[serial];
    const line = node.loc.start.line;
    if (node.type === "VariableDeclaration") {
      // if (node.kind === "let") {
      //   print({
      //     prefix: line,
      //     logs: ["declare:", variable],
      //   });
      // } else if (node.kind === "const") {
      print({
        prefix: line,
        logs: ["declare (" + node.kind + "):", variable],
      });
      // }
    }
    if (
      node.type === "AssignmentExpression" ||
      node.type === "ExpressionStatement" ||
      node.type === "VariableDeclaration"
    ) {
      print({
        prefix: line,
        // logs: ["assigning to '" + variable + "': ", value],
        logs: [
          variable + " <- ",
          typeof value === "function"
            ? "a function named " + value.name
            : value,
        ],
      });
    }
    // console.log(value);
    // console.log(variable);
    // console.log(serial);
    // console.log(node);
    return value;
  },
};
