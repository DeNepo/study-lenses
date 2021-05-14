/*
  - scope questions
    when begin? when end?
    which varaible declared in the scope?
    which variables available in the scope?
  - alternatives
    can you think of another way to write line _ without changing it's behavior?
    could you use a different type of loop on line _?


*/

import * as filters from "./node-filters.js";
import * as helpers from "./helpers.js";
import * as collections from "./node-type-collections.js";

export const questions = [
  // === control flow ===
  {
    name: "nested control flow",
    template: ({ nodes }) => {
      const nestedNodes = Object.values(nodes)
        .flatMap((i) => i)
        .filter(helpers.isControlFlow)
        .filter(helpers.isNested);
      const randomNestedNode =
        nestedNodes[(nestedNodes.length * Math.random()) | 0];
      return `On line ${
        randomNestedNode.loc.start.line
      } there is a nested ${helpers.friendlyName(
        randomNestedNode
      )}, what is it nested inside of?`;
    },
    nodeTypes: ({ nodes }) =>
      Object.values(nodes)
        .flatMap((i) => i)
        .filter(helpers.isControlFlow)
        .filter(helpers.isNested).length > 0,
    levels: [1],
    features: ["controlFlow"],
  },
  {
    name: "begin and end of a control flow",
    template: ({ node }) =>
      `On line ${node.loc.start.line} there is a ${helpers.friendlyName(
        node
      )}, what is it's purpose in the program?`,
    nodeTypes: filters.randomControlFlowNode,
    levels: [3],
    features: ["controlFlow"],
  },
  {
    name: "where does it begin?",
    template: ({ node }) =>
      `A control flow structure ends on line ${node.loc.end.line}.
- What line does it start on?
- What type of control flow is it?`,
    nodeTypes: filters.randomControlFlowNode,
    levels: [1],
    features: ["controlFlow"],
  },
  {
    name: "conditional paths",
    template: ({ nodes }) => {
      const validNodes = filters.firstIfNodes({ nodes });

      const randomIf = validNodes[(validNodes.length * Math.random()) | 0];
      return `Describe the execution paths of the conditional that starts on line ${randomIf.loc.start.line}`;
    },
    nodeTypes: filters.firstIfNodes,
    levels: [2],
    features: ["controlFlow"],
  },
  {
    name: "goal of control flow",
    template: ({ node }) =>
      `What is the goal of the ${helpers.friendlyName(
        node
      )} that begins on line ${node.loc.start.line} and ends on line ${
        node.loc.end.line
      }?`,
    nodeTypes: filters.randomControlFlowNode,
    levels: [4],
    features: ["controlFlow"],
  },
  {
    name: "stopping condition while loop",
    template: ({ node }) =>
      `What needs to happen for the while loop on line ${node.loc.start.line} to exit?`,
    nodeTypes: ["WhileStatement"],
    levels: [2],
    features: ["controlFlow"],
  },
  {
    name: "next lines",
    template: ({ node }) => {
      return `Which lines can happen after line ${node.loc.start.line}?`;
    },
    nodeTypes: [
      ...collections.controlFlowNodeTypes,
      ...collections.breakContinue,
    ],
    levels: [2],
    features: ["controlFlow"],
  },
  {
    name: "describe the condition",
    template: ({ node }) => {
      return `How would you describe the logic in the '${helpers.friendlyName(
        node
      )}' check on line ${node.loc.start.line}?`;
    },
    nodeTypes: ["IfStatement", "WhileStatement", "ForStatement"],
    levels: [2],
    features: ["controlFlow"],
  },

  // === data ===
  {
    template: () => `How many data types are used in this program?`,
    levels: [1],
    features: ["data"],
  },
  {
    template: ({ node }) =>
      `What type(s) are assigned to the variable '${node.id.name}' in this program?`,
    levels: [1],
    nodeTypes: ["VariableDeclarator"],
    features: ["data"],
  },
  {
    name: "data literals",
    template: ({ filtered }) => {
      const randomLiteral = filtered[(filtered.length * Math.random()) | 0];
      const typeName =
        typeof randomLiteral.value === "string"
          ? "a string"
          : typeof randomLiteral.value === "number"
          ? "a number"
          : typeof randomLiteral.value === "boolean"
          ? "a boolean"
          : randomLiteral.type === "ArrayExpression"
          ? "an array"
          : randomLiteral.type === "ObjectExpression"
          ? "an object"
          : randomLiteral.type === "TemplateLiteral"
          ? "a string"
          : randomLiteral.type === "Identifier"
          ? "undefined"
          : "null";
      return `On line ${randomLiteral.loc.start.line} ${typeName}:
- How is this data used?
- What purpose does it have in the program?
- Is it important later on in the program?`;
    },
    levels: [3],
    nodeTypes: filters.dataLiterals,
    features: ["data"],
  },

  // === operators ===
  {
    name: "how many times an operator is used",
    template: ({ nodes }) => {
      const operators = [
        ...new Set(filters.operatorNodes({ nodes }).map((n) => n.operator)),
      ];
      const randomOperator = operators[(operators.length * Math.random()) | 0];
      return `How many times is the '${randomOperator}' operator used in this program?`;
    },
    nodeTypes: filters.randomOperatorNode,
    levels: [1],
    features: ["operators"],
  },
  {
    name: "operators on line x",
    template: ({ nodes }) => {
      const randomNode = filters.randomOperatorNode({ nodes });
      return `How many operators are used on line ${randomNode.loc.start.line}?`;
    },
    nodeTypes: filters.randomOperatorNode,
    levels: [1],
    features: ["operators"],
  },
  {
    name: "name of operator",
    template: ({ nodes }) => {
      const operators = [
        ...new Set(filters.operatorNodes({ nodes }).map((n) => n.operator)),
      ];
      const randomOperator = operators[(operators.length * Math.random()) | 0];
      return `What do you call the '${randomOperator}' operator? What does it do?`;
    },
    nodeTypes: filters.randomOperatorNode,
    levels: [1],
    features: ["operators"],
  },

  // === variables ===
  {
    template: ({ node }) =>
      `On which line is the variable '${node.id.name}' declared?
- Is it initialized?`,
    levels: [1],
    nodeTypes: ["VariableDeclarator"],
    features: ["variables"],
  },
  {
    template: ({ node }) =>
      `On how many lines is the variable '${node.id.name}' assigned a value?`,
    levels: [1],
    nodeTypes: ["VariableDeclarator"],
    features: ["variables"],
  },
  {
    template: ({ node }) =>
      `On how many lines is the variable '${node.id.name}' read?`,
    levels: [1],
    nodeTypes: ["VariableDeclarator"],
    features: ["variables"],
  },
  {
    template: ({ node }) =>
      `What is the role of the variable '${node.id.name}' in this program?`,
    levels: [4],
    nodeTypes: ["VariableDeclarator"],
    features: ["variables"],
  },
  {
    template: ({ node }) =>
      `Why is the variable declared on line ${node.loc.start.line} named '${node.id.name}'?
- Can you think of a better name?`,
    levels: [3],
    nodeTypes: ["VariableDeclarator"],
    features: ["variables"],
  },
  {
    template: ({ node }) => `What types are assigned to '${node.id.name}'?`,
    levels: [0],
    nodeTypes: ["VariableDeclarator"],
    features: ["variables"],
  },
  {
    template: ({ nodes }) => {
      const identifierNames = new Set();
      const uniqueIdentifiers = nodes.Identifier.filter((node) => {
        if (identifierNames.has(node.name)) {
          return false;
        } else {
          identifierNames.add(node.name);
          return true;
        }
      });
      const node =
        uniqueIdentifiers[(uniqueIdentifiers.length * Math.random()) | 0];
      return `Is the name '${node.name}' built into JS, or did the developer write it?`;
    },
    levels: [1],
    nodeTypes: ["Identifier"],
    features: ["variables"],
  },
  {
    template: ({ node }) =>
      `On line ${node.loc.start.line}, what value is assigned to '${node.left.name}'?
- Where does this value come from?`,
    levels: [0],
    nodeTypes: ["AssignmentExpression"],
    features: ["variables"],
  },
  {
    template: ({ nodes }) => {
      const numberOfDeclarators = nodes.VariableDeclarator.length;
      return `There are ${numberOfDeclarators} variables declared in this program, what are their names?`;
    },
    levels: [0],
    features: ["variables"],
  },
  {
    template: ({ nodes }) => {
      const identifier = nodes.Identifier.find(
        (node) =>
          node.parent.type !== "VariableDeclarator" &&
          node.parent.type !== "CallExpression"
      );
      return `On line ${identifier.loc.start.line}, how many variables are used?
- Where were they declared? Where else are they used?`;
    },
    levels: [0],
    features: ["variables"],
  },
  {
    template: ({ nodes }) => {
      const identifierNames = new Set();
      const uniqueIdentifiers = nodes.Identifier.filter((node) => {
        if (identifierNames.has(node.name)) {
          return false;
        } else {
          identifierNames.add(node.name);
          return true;
        }
      });
      const node =
        uniqueIdentifiers[(uniqueIdentifiers.length * Math.random()) | 0];
      return `Is the name '${node.name}' built into JS, or did the developer write it?`;
    },
    levels: [1],
    nodeTypes: ["Identifier"],
    features: ["variables"],
  },
  {
    template: ({ node }) => {
      return `What data is assigned to '${node.left.name}' on line ${node.loc.start.line}?
- Where does this data come from?
- What is it used for in the program?`;
    },
    levels: [3, 4],
    nodeTypes: ["AssignmentExpression"],
    features: ["variables", "data"],
  },
  {
    name: "declaration in a block",
    template: ({ nodes }) => {
      const nestedDeclarations = filters.declarationsInBlocks({ nodes });
      const declaration =
        nestedDeclarations[(nestedDeclarations.length * Math.random()) | 0];

      return `On line ${declaration.loc.start.line} the variable '${declaration.id.name}' is declared inside of a block.
- Are there any other variables in the program with the same name?
- Is it's value ever assigned to a variable from the parent scope?`;
    },
    levels: [1, 3],
    nodeTypes: filters.declarationsInBlocks,
    features: ["variables"],
  },
  {
    name: "variables in a block",
    template: ({
      node,
    }) => `There is a block that ends on line ${node.loc.end.line}, where does it begin?
- How many variables are used in this block?
- How many of them are declared in this block?`,
    levels: [1, 3],
    nodeTypes: ["BlockStatement"],
    features: ["variables"],
  },
  {
    name: "assignment in a block",
    template: ({ nodes }) => {
      const nestedAssignments = filters.assignmentsInBlocks({ nodes });
      const assignment =
        nestedAssignments[(nestedAssignments.length * Math.random()) | 0];

      return `On line ${assignment.loc.start.line} there is an assignment inside of a block:
- What data is being assigned? What's it's type?
- Where does that data come from?
- Is that data used outside of the block later in the program?`;
    },
    levels: [1, 3],
    nodeTypes: filters.assignmentsInBlocks,
    features: ["variables", "data"],
  },

  // === generic ===
  {
    template: () => `How many user interactions are there in this program?`,
    levels: [5],
  },
  {
    template: () =>
      `On how many lines is the user asked to input data?
- What are they asked to input?`,
    levels: [5],
  },
  {
    template: () => `How many paths are there to the user journey?`,
    levels: [5],
  },

  {
    template: ({ code }) => {
      const codeLines = code
        .split("\n")
        .map((code, number) => ({ code, number }))
        .filter((line) => line.code.length !== 0);
      const randomLine = codeLines[(codeLines.length * Math.random()) | 0];
      return `How would you read line ${randomLine.number} out loud?`;
    },
    levels: [1],
  },

  // === functions ===
  {
    template: ({ node }) =>
      `There is a function call on line ${node.loc.start.line}, what is the function's name?
- What arguments does the function take?`,
    features: ["functions"],
    nodeTypes: ["CallExpression"],
    levels: [1],
  },
];
