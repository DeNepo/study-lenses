import * as collections from "./node-type-collections.js";

export const isControlFlow = (node) =>
  collections.controlFlowNodeTypes.includes(node.type);

export const friendlyName = (node) => {
  if (node.type === "IfStatement") {
    return "if";
  } else if (node.type === "SwitchStatement") {
    return "case";
  } else if (node.type === "SwitchCase") {
    return "case";
  } else if (node.type === "WhileStatement") {
    return "while loop";
  } else if (node.type === "DoWhileStatement") {
    return "do-while loop";
  } else if (node.type === "ForStatement") {
    return "for loop";
  } else if (node.type === "ForOfStatement") {
    return "for-of loop";
  } else if (node.type === "ForInStatement") {
    return "for-in loop";
  }
};

export const isNested = (node) => {
  let itIs = false;
  let nextNode = node;
  while (nextNode.parent) {
    if (
      collections.controlFlowNodeTypes.includes(nextNode.parent.type) &&
      // because of if-else
      nextNode.parent.type !== nextNode.type
    ) {
      itIs = true;
      break;
    } else if (collections.functionNodeType.includes(nextNode.parent.type)) {
      break;
    }

    nextNode = nextNode.parent;
  }
  return itIs;
};
