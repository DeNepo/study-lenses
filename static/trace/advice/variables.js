"use strict";

import { config } from "../data/config.js";
import { print } from "../lib/print.js";
import { aran } from "../setup.js";

export default {
  read: (value, variable, serial) => {
    if (!config.variablesRead) {
      return value;
    }
    if (config.variables.length !== 0 && !config.variables.includes(variable)) {
      return value;
    }
    // because aran encodes generated variables as number strings
    if (!isNaN(variable)) {
      return value;
    }
    const node = aran.nodes[serial];
    const line = node.loc.start.line;
    const col = node.loc.start.column;
    print({
      prefix: [line, col],
      logs: [(node.left ? node.left.name : variable) + " (read):", value],
    });
    // console.log("value:", value);
    // console.log("variable:", variable);
    // console.log("serial:", serial);
    // console.log("node:", node);
    return value;
  },
  write: (value, variable, serial) => {
    if (!(config.variablesWrite || config.variablesDeclare)) {
      return value;
    }
    if (config.variables.length !== 0 && !config.variables.includes(variable)) {
      return value;
    }
    // because aran encodes generated variables as number strings
    if (!isNaN(variable)) {
      return value;
    }

    const node = aran.nodes[serial];
    const line = node.loc.start.line;
    const col = node.loc.start.column;

    if (node.type === "VariableDeclaration" && config.variablesDeclare) {
      const logs = [];
      if (node.declarations[0].init) {
        logs.push(variable + " (declare " + node.kind + ", init):");
        logs.push(value);
      } else {
        logs.push(variable + " (declare " + node.kind + ")");
      }
      print({
        prefix: [line, col],
        logs,
      });
    }
    if (
      (node.type === "AssignmentExpression" ||
        node.type === "ExpressionStatement") &&
      config.variablesAssign
    ) {
      print({
        prefix: [line, col],
        logs: [variable + " (assign):", value],
      });
    }
    // console.log(value);
    // console.log(variable);
    // console.log(serial);
    // console.log(node);
    return value;
  },
};
