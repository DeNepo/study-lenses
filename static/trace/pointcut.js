"use strict";

export const pointcut = (name, node) => {
  // console.log(name, node);
  if (name === "apply" && node.type === "CallExpression") {
    return true;
  } else if (name === "read" && node.type === "Identifier") {
    return true;
  } else if (
    name === "write" &&
    (node.type === "VariableDeclaration" ||
      node.type === "AssignmentExpression" ||
      node.type === "ExpressionStatement")
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
