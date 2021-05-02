// helper functions

const operatorNodes = ({ nodes }) => {
  const expressionNodes = [];
  for (const key in nodes) {
    if (key.includes("Expression")) {
      expressionNodes.push(...nodes[key]);
    }
  }
  return expressionNodes.filter((node) => "operator" in node);
};

const randomOperatorNode = ({ nodes }) => {
  const filteredNodes = operatorNodes({ nodes }).filter(
    (node) => "operator" in node
  );
  return filteredNodes[(filteredNodes.length * Math.random()) | 0];
};

// the questions

export const operators = [
  {
    name: "how many times an operator is used",
    template: ({ nodes }) => {
      const operators = [
        ...new Set(operatorNodes({ nodes }).map((n) => n.operator)),
      ];
      const randomOperator = operators[(operators.length * Math.random()) | 0];
      return `How many times is the '${randomOperator}' operator used in this program?`;
    },
    type: randomOperatorNode,
    level: 1,
  },
  {
    name: "operators on line x",
    template: ({ nodes }) => {
      const randomNode = randomOperatorNode({ nodes });
      return `How many operators are used on line ${randomNode.loc.start.line}?`;
    },
    type: randomOperatorNode,
    level: 1,
  },
];
