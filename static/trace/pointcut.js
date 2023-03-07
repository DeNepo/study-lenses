const newPointcut = {
  test: (node) => {
    return true || false;
  },
  test: true, // same as () => true for this API
};

('use strict');

import { config } from './data/config.js';
import { state } from './data/state.js';

export const pointcut = (name, node) => {
  // console.log(name, node.type, node);

  // if (
  //   node.type === "VariableDeclaration" &&
  //   node.kind === "var" &&
  //   config.variablesDeclare
  // ) {
  //   if (!state.hoisted.includes(node)) {
  //     state.hoisted.push(node);
  //   }
  // }
  // if (node.type === "FunctionDeclaration" && config.functionDeclarations) {
  //   if (!state.hoisted.includes(node)) {
  //     state.hoisted.push(node);
  //   }
  // }

  if (
    name === 'test' &&
    (node.type === 'LogicalExpression' ||
      node.type === 'ConditionalExpression') &&
    config.operators
  ) {
    return true;
  }
  if (
    name !== 'test' &&
    (node.type === 'LogicalExpression' ||
      node.type === 'ConditionalExpression') &&
    !config.operators
  ) {
    return false;
  }

  if (name === 'failure') {
    return true;
  } else if ((name === 'error' || name === 'throw') && config.errorHandling) {
    return true;
  } else if (
    (name === 'test' || name === 'break' || name === 'continue') &&
    config.controlFlow &&
    (node.type === 'ConditionalExpression' ||
      node.type === 'IfStatement' ||
      node.type === 'SwitchCase' ||
      node.type === 'WhileStatement' ||
      node.type === 'DoWhileStatement' ||
      node.type === 'ForStatement' ||
      node.type === 'ForOfStatement' ||
      node.type === 'ForInStatement' ||
      node.type === 'BreakStatement' ||
      node.type === 'ContinueStatement')
  ) {
    return true;
  } else if (
    name === 'unary' &&
    node.type === 'UnaryExpression' &&
    config.operators
  ) {
    return true;
  } else if (
    name === 'binary' &&
    node.type === 'BinaryExpression' &&
    config.operators
  ) {
    return true;
  } else if (
    // to properly disable console.logs, this cannot be pointcutted by config
    // (config.functions || config.console) &&
    name === 'apply' &&
    node.type === 'CallExpression'
  ) {
    return true;
  } else if (config.newInstance && name === 'construct') {
    return true;
  } else if (
    config.variablesRead &&
    name === 'read' &&
    (node.type === 'Identifier' ||
      node.type === 'ForStatement' ||
      node.type === 'ExpressionStatement' ||
      node.type === 'UpdateExpression' ||
      node.type === 'UnaryExpression')
  ) {
    return true;
  } else if (
    (config.variablesAssign || config.variablesDeclare) &&
    name === 'write' &&
    (node.type === 'Identifier' ||
      node.type === 'AssignmentExpression' ||
      node.type === 'ExpressionStatement' ||
      node.type === 'ForOfStatement' ||
      node.type === 'ForInStatement' ||
      node.type === 'ForStatement' ||
      node.type === 'VariableDeclarator' ||
      node.type === 'VariableDeclaration' ||
      node.type === 'UpdateExpression')
    // ||
    // node.type === "FunctionDeclaration"
  ) {
    return true;
  } else if (
    name === 'enter' &&
    config.blockScope &&
    node.type === 'BlockStatement'
  ) {
    return true;
  } else if (
    name === 'leave' &&
    config.blockScope &&
    node.type === 'BlockStatement'
  ) {
    return true;
  }

  // if (node.type !== "Program") {
  //   // console.log(name, node);
  // }
  // ...
};
