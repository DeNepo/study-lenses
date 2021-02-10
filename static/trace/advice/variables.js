"use strict";

import { config } from "../data/config.js";
import { print } from "../lib/print.js";
import { aran } from "../setup.js";

export default {
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
        (node.left ? node.left.name : variable) + ", read:",
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
        logs: [variable + ", declare:", node.kind],
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
          // variable + " <- ",
          variable + ", assign:",
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
