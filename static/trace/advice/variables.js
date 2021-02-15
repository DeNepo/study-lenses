"use strict";

import { deepClone } from "../lib/deep-clone.js";
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
        (node.left ? node.left.name : variable) + " (read):",
        deepClone(
          typeof value === "function" ? "a function named " + value.name : value
        ),
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
    if (node.type === "VariableDeclaration" && config.variables.declare) {
      const logs = [];
      // if (Array.isArray(node.declarations) && node.declarations.length > 0) {
      if (node.declarations[0].init) {
        logs.push(variable + " (declare " + node.kind + ", init):");
        logs.push(
          deepClone(
            typeof value === "function"
              ? value.name + " (function name)"
              : value
          )
        );
      } else {
        logs.push(variable + " (declare " + node.kind + ")");
      }
      print({
        prefix: line,
        logs,
      });
    }
    if (
      (node.type === "AssignmentExpression" ||
        node.type === "ExpressionStatement") &&
      config.variables.assign
    ) {
      print({
        prefix: line,
        // logs: ["assigning to '" + variable + "': ", value],
        logs: [
          // variable + " <- ",
          variable + " (assign):",
          deepClone(
            typeof value === "function"
              ? value.name + " (function name)"
              : value
          ),
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
