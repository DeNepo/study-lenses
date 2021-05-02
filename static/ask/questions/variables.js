export const variables = [
  // VariableDeclarator
  {
    template: ({ node }) =>
      `On which line is the variable '${node.id.name}' declared?\nIs it initialized?`,
    level: 1,
    type: "VariableDeclarator",
  },
  {
    template: ({ node }) =>
      `How many assignments are there to the variable '${node.id.name}'?`,
    level: 1,
    type: "VariableDeclarator",
  },
  {
    template: ({ node }) =>
      `On how many lines is the variable '${node.id.name}' read?`,
    level: 1,
    type: "VariableDeclarator",
  },
  {
    template: ({ node }) =>
      `What is the role of the variable '${node.id.name}' in this program?`,
    level: 3,
    type: "VariableDeclarator",
  },
  {
    template: ({ node }) =>
      `Why is the variable declared on line ${node.loc.start.line} named '${node.id.name}'?\nCan you think of a better name?`,
    level: 3,
    type: "VariableDeclarator",
  },
  {
    template: ({ node }) => `What types are assigned to '${node.id.name}'?`,
    level: 0,
    type: "VariableDeclarator",
  },

  // AssignmentExpression
  {
    template: ({ node }) =>
      `On line ${node.loc.start.line}, what value is assigned to '${node.left.name}'? \nWhere does this value come from?`,
    level: 0,
    type: "AssignmentExpression",
  },

  // no specific node type
  {
    template: ({ nodes }) => {
      const numberOfDeclarators = nodes.VariableDeclarator.length;
      return `There are ${numberOfDeclarators} variables declared in this program, what are their names?`;
    },
    level: 0,
  },
  {
    template: ({ nodes }) => {
      const identifier = nodes.Identifier.find(
        (node) =>
          node.parent.type !== "VariableDeclarator" &&
          node.parent.type !== "CallExpression"
      );
      return `On line ${identifier.loc.start.line}, how many variables are used? \nWhere were they declared? Where else are they used?`;
    },
    level: 0,
  },
];
