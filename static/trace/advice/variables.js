"use strict";

import { config } from "../data/config.js";
import { print } from "../lib/trace-log.js";
import { aran } from "../setup.js";
import { isInRange } from "../lib/is-in-range.js";

/* ++, --

  - normalization always stars with a read
  check if node is an update
  then update state
  also check if operators are enabled

  state: add something
    - in an update or not

  questions, does it point to

------

if tacing operators & variables is enabled

  4. line 3:2 - operator (_++): variable++
    read variable: 3
    operator (+): 3 + 1
      evaluates to: 4
    assign variable: 4
    evaluates to: 3



if only tracing variables

  read variable: 3
  assign variable: 4



if only operators

  4. line 3:2 - operator (_++): variable++
    operator (+): 3 + 1
      evaluates to: 4
    evaluates to: 3

----

dirty hack:
  first trap is read
  he will have an associated node
    is that node the identifier or update expression?
  set it in state

  possible ending traps
    read, write, apply
    need to check for leaving UpdateExpression in these

  at leaving every read/write/apply
    if state.updateExpression !== null
      go recursively thorugh the update
      if  the current node is not a child of the update
        set it to null



*/

export default {
  read: (value, variable, serial) => {
    const node = aran.nodes[serial];
    if (!isInRange(node)) {
      return value;
    }

    // console.log(node);

    if (!config.variablesRead) {
      return value;
    }
    if (
      config.variablesList.length !== 0 &&
      // !config.variablesList.find((query) => new RegExp(query).test(variable))
      !config.variablesList.includes(variable)
    ) {
      return value;
    }
    // because aran encodes generated variables as number strings
    if (!isNaN(variable)) {
      return value;
    }
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
    const node = aran.nodes[serial];
    if (!isInRange(node)) {
      return value;
    }
    // console.log(node);

    if (!(config.variablesAssign || config.variablesDeclare)) {
      return value;
    }
    if (
      config.variablesList.length !== 0 &&
      // !config.variablesList.find((query) => new RegExp(query).test(variable))
      !config.variablesList.includes(variable)
    ) {
      return value;
    }
    // because aran encodes generated variables as number strings
    if (!isNaN(variable)) {
      return value;
    }

    const line = node.loc.start.line;
    const col = node.loc.start.column;

    if (node.type === "VariableDeclaration" && config.variablesDeclare) {
      print({
        prefix: [line, col],
        logs: [variable + " (declare, " + node.kind + ")"],
      });
    }
    if (node.declarations && node.declarations[0].init) {
      print({
        prefix: [line, col],
        logs: [variable + " (initialize):", value],
      });
    }
    if (
      (node.type === "AssignmentExpression" ||
        node.type === "UpdateExpression" ||
        node.type === "ForOfStatement" ||
        node.type === "ForInStatement" ||
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
  enter: (tag, labels, variables, serial) => {
    // console.log(tag, labels, variables, serial);
    if (tag !== "loop") {
      return;
    }

    const node = aran.nodes[serial];
    // console.log(node);
    if (!isInRange(node)) {
      return;
    }

    if (node.type !== "ForOfStatement" && node.type !== "ForInStatement") {
      return;
    }

    // console.log(node);

    if (!config.variablesDeclare) {
      return;
    }

    const line = node.loc.start.line;
    const col = node.loc.start.column;
    for (const variable of variables) {
      if (!isNaN(variable)) {
        continue;
      }
      if (
        config.variablesList.length !== 0 &&
        // !config.variablesList.find((query) => new RegExp(query).test(variable))
        !config.variablesList.includes(variable)
      ) {
        continue;
      }
      print({
        prefix: [line, col],
        logs: [variable + " (declare)"],
      });
    }
    // console.log("value:", value);
    // console.log("variable:", variable);
    // console.log("serial:", serial);
    // console.log("node:", node);
  },
};
