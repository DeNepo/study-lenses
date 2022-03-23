import * as helpers from "./helpers.js";
// import * as collections from "./node-type-collections.js";

export const operatorNodes = ({ nodes }) => {
  const expressionNodes = [];
  for (const key in nodes) {
    if (key.includes("Expression")) {
      expressionNodes.push(...nodes[key]);
    }
  }
  return expressionNodes.filter((node) => "operator" in node);
};

export const randomOperatorNode = ({ nodes }) => {
  const filteredNodes = operatorNodes({ nodes }).filter(
    (node) => "operator" in node
  );
  return filteredNodes[(filteredNodes.length * Math.random()) | 0];
};

export const equalities = ({ nodes }) =>
  nodes.filter(
    (node) =>
      node.type === "BinaryExpression" &&
      (node.operator === "===" ||
        node.operator === "!===" ||
        node.operator === "==" ||
        node.operator === "!=")
  );

export const randomControlFlowNode = ({ nodes }) => {
  const controlFlows = Object.values(nodes)
    .flatMap((i) => i)
    .filter(helpers.isControlFlow)
    // to not treat else-if's as standalone constructs
    .filter((node) => (node.parent ? node.type !== node.parent.type : true));
  // console.log(controlFlows);
  return controlFlows[(controlFlows.length * Math.random()) | 0].type;
};

export const firstIfNodes = ({ nodes }) => {
  if (!nodes.IfStatement) {
    return false;
  }

  const firstIfs = [];
  for (const ifStatement of nodes.IfStatement) {
    // skip if's that are an else-if
    if (ifStatement.parent.type === "IfStatement") continue;
    firstIfs.push(ifStatement);
  }

  return firstIfs;
};

export const declarationsInBlocks = ({ nodes }) => {
  if (!nodes.VariableDeclarator) {
    return false;
  }

  const inBlocks = nodes.VariableDeclarator.filter((declarator) => {
    let nextNode = declarator;
    while (nextNode.parent) {
      if (nextNode.parent.type === "BlockStatement") {
        return true;
      } else if (!nextNode.parent) {
        return false;
      }
      nextNode = nextNode.parent;
    }
  });

  if (inBlocks.length === 0) {
    return false;
  }

  return inBlocks;
};

export const assignmentsInBlocks = ({ nodes }) => {
  if (!nodes.AssignmentExpression) {
    return false;
  }

  const inBlocks = nodes.AssignmentExpression.filter((declarator) => {
    let nextNode = declarator;
    while (nextNode.parent) {
      if (nextNode.parent.type === "BlockStatement") {
        return true;
      } else if (!nextNode.parent) {
        return false;
      }
      nextNode = nextNode.parent;
    }
  });

  if (inBlocks.length === 0) {
    return false;
  }

  return inBlocks;
};

export const dataLiterals = ({ nodes }) => {
  if (
    nodes.ArrayExpression ||
    nodes.Literal ||
    (node.Identifier &&
      node.Identifier.includes((id) => id.name === "undefined")) ||
    nodes.ObjectExpression ||
    nodes.TemplateLiteral
  ) {
    const literals = [
      ...(nodes.ArrayExpression ? nodes.ArrayExpression : []),
      ...(nodes.Literal ? nodes.Literal : []),
      ...(nodes.Identifier
        ? nodes.Identifier.filter((id) => id.name === "undefined")
        : []),
      ...(nodes.ObjectExpression ? nodes.ObjectExpression : []),
      ...(nodes.TemplateLiteral ? nodes.TemplateLiteral : []),
    ];
    return literals;
  } else {
    return false;
  }
};
