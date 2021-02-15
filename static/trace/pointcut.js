"use strict";

import { config } from "./data/config.js";

export const pointcut = (name, node) => {
  // console.log(name, node);

  if (name === "failure") {
    return true;
  } else if (
    name === "test" &&
    node.type === "ConditionalExpression" &&
    config.operators
  ) {
    return true;
  } else if (
    name === "unary" &&
    node.type === "UnaryExpression" &&
    config.operators
  ) {
    return true;
  } else if (
    name === "binary" &&
    node.type === "BinaryExpression" &&
    config.operators
  ) {
    return true;
  } else if (
    name === "return" &&
    node.type === "ReturnStatement" &&
    config.functions
  ) {
    // return true;
  } else if (
    (config.functions ||
      config.console ||
      config.interactions ||
      config.document) &&
    name === "apply" &&
    node.type === "CallExpression"
  ) {
    return true;
  } else if (
    config.variables.read &&
    name === "read" &&
    node.type === "Identifier"
  ) {
    return true;
  } else if (
    name === "write" &&
    (node.type === "AssignmentExpression" ||
      node.type === "ExpressionStatement" ||
      node.type === "VariableDeclaration")
  ) {
    return true;
  }
  // else if (
  //   (name === "enter" || name === "leave") &&
  //   node.type === "BlockStatement"
  // ) {
  //   return true;
  // }
  // if (node.type !== "Program") {
  //   // console.log(name, node);
  // }
  // ...
};
