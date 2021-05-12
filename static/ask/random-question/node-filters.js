import * as helpers from "./helpers.js";

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
