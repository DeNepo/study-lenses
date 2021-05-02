// -- constants --

const controlFlowNodeTypes = [
  "ConditionalExpression",
  "IfStatement",
  "SwitchStatement",
  "SwitchCase",
  "WhileStatement",
  "DoWhileStatement",
  "ForStatement",
  "ForOfStatement",
  "ForInStatement",
];

const breakContinue = ["BreakStatement", "ContinueStatement"];

const functionNodeType = [
  "ArrowFunctionExpression",
  "FunctionDeclaration",
  "FunctionExpression",
  "MethodDefinition",
];

// -- helper functions --
const isControlFlow = (node) => controlFlowNodeTypes.includes(node.type);

const friendlyName = (node) => {
  if (node.type === "IfStatement") {
    return "conditional";
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

const isNested = (node) => {
  let itIs = false;
  let nextNode = node;
  while (nextNode.parent) {
    if (
      controlFlowNodeTypes.includes(nextNode.parent.type) &&
      // because of if-else
      nextNode.parent.type !== nextNode.type
    ) {
      itIs = true;
      break;
    } else if (functionNodeType.includes(nextNode.parent.type)) {
      break;
    }

    nextNode = nextNode.parent;
  }
  return itIs;
};

const randomControlFlowNode = ({ nodes }) => {
  const controlFlows = Object.values(nodes)
    .flatMap((i) => i)
    .filter(isControlFlow)
    // to not treat else-if's as standalone constructs
    .filter((node) => (node.parent ? node.type !== node.parent.type : true));
  console.log(controlFlows);
  return controlFlows[(controlFlows.length * Math.random()) | 0].type;
};

const firstIfNodes = ({ nodes }) => {
  if (!nodes.IfStatement) {
    return [];
  }

  const firstIfs = [];
  for (const ifStatement of nodes.IfStatement) {
    // skip if's that are an else-if
    if (ifStatement.parent.type === "IfStatement") continue;
    firstIfs.push(ifStatement);
  }

  return firstIfs;
};

// -- questions --

export const controlFlow = [
  {
    name: "nested control flow",
    template: ({ nodes }) => {
      const nestedNodes = Object.values(nodes)
        .flatMap((i) => i)
        .filter(isControlFlow)
        .filter(isNested);
      const randomNestedNode =
        nestedNodes[(nestedNodes.length * Math.random()) | 0];
      return `On line ${
        randomNestedNode.loc.start.line
      } there is a nested ${friendlyName(
        randomNestedNode
      )}, what is it nested inside of?`;
    },
    type: ({ nodes }) =>
      Object.values(nodes)
        .flatMap((i) => i)
        .filter(isControlFlow)
        .filter(isNested).length > 0,
    level: 1,
  },
  {
    name: "begin and end of a control flow",
    template: ({ node }) =>
      `On line ${node.loc.start.line} there is a ${friendlyName(
        node
      )}, what is it's purpose in the program?`,
    type: randomControlFlowNode,
    level: 3,
  },
  {
    name: "conditional paths",
    template: ({ nodes }) => {
      const validNodes = firstIfNodes({ nodes });

      const randomIf = validNodes[(validNodes.length * Math.random()) | 0];
      return `Describe the paths of the conditional on line ${randomIf.loc.start.line}`;
    },
    type: firstIfNodes,
    level: 2,
  },
];
