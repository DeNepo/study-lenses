/*
  - scope questions
    when begin? when end?
    which varaible declared in the scope?
    which variables available in the scope?
  - alternatives
    can you think of another way to write line _ without changing it's behavior?
    could you use a different type of loop on line _?


*/

import * as filters from './node-filters.js';
import * as helpers from './helpers.js';
import * as collections from './node-type-collections.js';

export const questions = [
  // === control flow ===
  {
    name: 'nested control flow',
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
        randomNestedNode,
      )}, what is it nested inside of?`;
    },
    nodeTypes: ({ nodes }) =>
      Object.values(nodes)
        .flatMap((i) => i)
        .filter(helpers.isControlFlow)
        .filter(helpers.isNested).length > 0,
    levels: [1],
    features: ['controlFlow'],
  },
  {
    name: 'begin and end of a control flow',
    template: ({ node }) =>
      `On line ${node.loc.start.line} there is a '${helpers.friendlyName(
        node,
      )}' statement, what is it's purpose in the program?`,
    nodeTypes: filters.randomControlFlowNode,
    levels: [3],
    features: ['controlFlow'],
  },
  {
    name: 'where does it begin?',
    template: ({ node }) =>
      `A control flow structure ends on line ${node.loc.end.line}.
- What line does it start on?
- What type of control flow is it?`,
    nodeTypes: filters.randomControlFlowNode,
    levels: [1],
    features: ['controlFlow'],
  },
  {
    name: 'conditional paths',
    template: ({ nodes }) => {
      const validNodes = filters.firstIfNodes({ nodes });

      const randomIf = validNodes[(validNodes.length * Math.random()) | 0];

      return {
        question: `Describe the execution paths of the conditional that starts on line ${randomIf.loc.start.line}`,
        hints: [
          'the flowchart lens might be helpful',
          'https://www.programiz.com/javascript/if-else',
        ],
      };
    },
    nodeTypes: filters.firstIfNodes,
    levels: [2],
    features: ['controlFlow'],
  },
  {
    name: 'goal of control flow',
    template: ({ node }) =>
      `What is the goal of the '${helpers.friendlyName(
        node,
      )}' statement that begins on line ${
        node.loc.start.line
      } and ends on line ${node.loc.end.line}?`,
    nodeTypes: filters.randomControlFlowNode,
    levels: [4],
    features: ['controlFlow'],
  },
  {
    name: 'stopping condition while loop',
    template: ({ node }) =>
      `What needs to happen for the while loop on line ${node.loc.start.line} to exit?`,
    nodeTypes: ['WhileStatement'],
    levels: [2],
    features: ['controlFlow'],
  },
  {
    name: 'next lines',
    template: ({ node }) => {
      const hints = [
        'try tracing the program a few times with different inputs',
        'a flowchart might help',
      ];
      if (node.type === 'WhileStatement') {
        hints.push('https://www.programiz.com/javascript/while-loop');
      } else if (node.type === 'ForStatement') {
        hints.push('https://www.programiz.com/javascript/for-loop');
      } else if (node.type === 'IfStatement') {
        hints.push('https://www.programiz.com/javascript/if-else');
      } else if (node.type === 'ForOfStatement') {
        hints.push('https://www.programiz.com/javascript/if-else');
      } else if (node.type === 'BreakStatement') {
        hints.push('https://www.programiz.com/javascript/break-statement');
      } else if (node.type === 'ContinueStatement') {
        hints.push('https://www.programiz.com/javascript/continue-statement');
      }
      return {
        question: `Which lines can happen after line ${node.loc.start.line}?`,
        hints,
      };
    },
    nodeTypes: [
      ...collections.controlFlowNodeTypes,
      ...collections.breakContinue,
    ],
    levels: [2],
    features: ['controlFlow'],
  },
  {
    name: 'describe the condition',
    template: ({ node }) => {
      return `How would you describe the logic in the '${helpers.friendlyName(
        node,
      )}' check on line ${node.loc.start.line}?`;
    },
    nodeTypes: ['IfStatement', 'WhileStatement', 'ForStatement'],
    levels: [2],
    features: ['controlFlow'],
  },

  // === data ===
  {
    template: () => `How many data types are used in this program?`,
    levels: [1],
    features: ['data'],
  },
  {
    template: ({ node }) => ({
      question: `On line ${node.loc.start.line} the variable '${node.id.name}' is declared
-  What type(s) are assigned to it in the program?`,
      hints: ['the "variables" lens can help to find all the assignments'],
    }),
    levels: [1],
    nodeTypes: ['VariableDeclarator'],
    features: ['data'],
  },
  {
    name: 'data literals',
    template: ({ filtered }) => {
      const randomLiteral = filtered[(filtered.length * Math.random()) | 0];
      const typeName =
        typeof randomLiteral.value === 'string'
          ? 'a string'
          : typeof randomLiteral.value === 'number'
          ? 'a number'
          : typeof randomLiteral.value === 'boolean'
          ? 'a boolean'
          : randomLiteral.type === 'ArrayExpression'
          ? 'an array'
          : randomLiteral.type === 'ObjectExpression'
          ? 'an object'
          : randomLiteral.type === 'TemplateLiteral'
          ? 'a string'
          : randomLiteral.type === 'Identifier'
          ? 'undefined'
          : 'null';
      return {
        question: `On line ${randomLiteral.loc.start.line} there is a ${typeName}:
- How is this data used?
- What purpose does it have in the program?
- Is it important later on in the program?`,
        hints: [
          'the "variables" lens is helpful if the data is assigned to a variable',
        ],
      };
    },
    levels: [3],
    nodeTypes: filters.dataLiterals,
    features: ['data'],
  },

  // === operators ===
  {
    name: 'how many times an operator is used',
    template: ({ nodes }) => {
      const operators = [
        ...new Set(filters.operatorNodes({ nodes }).map((n) => n.operator)),
      ];
      const randomOperator = operators[(operators.length * Math.random()) | 0];
      return {
        question: `How many times is the '${randomOperator}' operator used in this program?`,
        hints: ['you can use control-f in the editor to search the code'],
      };
    },
    nodeTypes: filters.randomOperatorNode,
    levels: [1],
    features: ['operators'],
  },
  {
    name: 'operators on line x',
    template: ({ nodes }) => {
      const randomNode = filters.randomOperatorNode({ nodes });
      return `How many operators are used on line ${randomNode.loc.start.line}?`;
    },
    nodeTypes: filters.randomOperatorNode,
    levels: [1],
    features: ['operators'],
  },
  {
    name: 'name of operator',
    template: ({ nodes }) => {
      const operators = [
        ...new Set(filters.operatorNodes({ nodes }).map((n) => n.operator)),
      ];
      const randomOperator = operators[(operators.length * Math.random()) | 0];
      return {
        question: `What do you call the '${randomOperator}' operator? What does it do?`,
        hints: [
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators',
        ],
      };
    },
    nodeTypes: filters.randomOperatorNode,
    levels: [1],
    features: ['operators'],
  },

  {
    name: 'opposite comparison',
    template: ({ nodes }) => {
      const comparisons =
        nodes.BinaryExpression &&
        nodes.BinaryExpression.filter(
          (node) =>
            node.operator === '===' ||
            node.operator === '!==' ||
            node.operator === '==' ||
            node.operator === '!=',
        );
      const node = comparisons[(comparisons.length * Math.random()) | 0];
      const alternateOperator =
        node.operator === '==='
          ? '!=='
          : node.operator === '!=='
          ? '==='
          : node.operator === '=='
          ? '!='
          : node.operator === '!='
          ? '=='
          : '';

      const question = `On line ${node.loc.start.line} there is a '${node.operator}' operator.
How would the program behave if was replaced with '${alternateOperator}'?`;
      return { question };
    },
    nodeTypes: filters.equalities,
    // nodeTypes: ['BinaryExpression'],
    levels: [3],
    features: ['operators'],
  },

  // === variables ===
  {
    template: () => ({
      question: `How many variables are declared in this program?`,
    }),
    levels: [1],
    nodeTypes: ['VariableDeclarator'],
    features: ['variables'],
  },
  {
    template: ({ node }) => ({
      question: `On which line is the variable '${node.id.name}' declared?
- Is it initialized?`,
      hints: [
        'ctr-f will find all the uses',
        'the "trace" button can help',
        'so can the ?variables lens',
      ],
    }),
    levels: [1],
    nodeTypes: ['VariableDeclarator'],
    features: ['variables'],
  },
  {
    template: ({ node }) => ({
      question: `On how many lines is the variable '${node.id.name}' assigned a value?`,
      hints: ['the "variables" lens is helpful'],
    }),
    levels: [1],
    nodeTypes: ['VariableDeclarator'],
    features: ['variables'],
  },
  {
    template: ({ node }) => ({
      question: `On how many lines is the variable '${node.id.name}' read?`,
      hints: ['the "variables" lens is helpful'],
    }),
    levels: [1],
    nodeTypes: ['VariableDeclarator'],
    features: ['variables'],
  },
  {
    template: ({ node }) => ({
      question: `What is the role of the variable '${node.id.name}' in this program?`,
      hints: [
        'https://en.wikibooks.org/wiki/A-level_Computing/AQA/Problem_Solving,_Programming,_Data_Representation_and_Practical_Exercise/Fundamentals_of_Programming/The_Role_of_Variables',
        'https://quizlet.com/82821321/variable-roles-flash-cards/',
        'http://saja.kapsi.fi/var_roles/role_intro.html',
      ],
    }),
    levels: [4],
    nodeTypes: ['VariableDeclarator'],
    features: ['variables'],
  },
  {
    template: ({ node }) =>
      `Why is the variable declared on line ${node.loc.start.line} named '${node.id.name}'?
- Can you think of a better name?`,
    levels: [3],
    nodeTypes: ['VariableDeclarator'],
    features: ['variables'],
  },
  {
    template: ({ node }) => `What types are assigned to '${node.id.name}'?`,
    levels: [0],
    nodeTypes: ['VariableDeclarator'],
    features: ['variables'],
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
      return `On line ${node.loc.start.line}, is the name '${node.name}' built into JS?`;
    },
    levels: [1],
    nodeTypes: ['Identifier'],
    features: ['variables'],
  },
  {
    template: ({ node }) =>
      `On line ${node.loc.start.line}, what value is assigned to '${node.left.name}'?
- Where does this value come from?`,
    levels: [0],
    nodeTypes: ['AssignmentExpression'],
    features: ['variables'],
  },
  {
    template: ({ nodes }) => {
      const numberOfDeclarators = nodes.VariableDeclarator.length;
      return `There are ${numberOfDeclarators} variables declared in this program, what are their names?`;
    },
    levels: [0],
    features: ['variables'],
  },
  {
    template: ({ nodes }) => {
      const identifier = nodes.Identifier.find(
        (node) =>
          node.parent.type !== 'VariableDeclarator' &&
          node.parent.type !== 'CallExpression',
      );
      return `On line ${identifier.loc.start.line}, how many variables are used?
- Where were they declared? Where else are they used?`;
    },
    levels: [0],
    features: ['variables'],
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
      return `Where is the name '${node.name}' defined?
- In this file
- In a different file
- It is built into JavaScript`;
    },
    levels: [1],
    nodeTypes: ['Identifier'],
    features: ['variables'],
  },
  {
    template: ({ node }) => {
      return `What data is assigned to '${node.left.name}' on line ${node.loc.start.line}?
- Where does this data come from?
- What is it used for in the program?`;
    },
    levels: [3, 4],
    nodeTypes: ['AssignmentExpression'],
    features: ['variables', 'data'],
  },
  {
    name: 'declaration in a block',
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
    features: ['variables'],
  },
  {
    name: 'variables in a block',
    template: ({
      node,
    }) => `There is a block that ends on line ${node.loc.end.line}, where does it begin?
- How many variables are used in this block?
- How many of them are declared in this block?`,
    levels: [1, 3],
    nodeTypes: ['BlockStatement'],
    features: ['variables'],
  },
  {
    name: 'assignment in a block',
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
    features: ['variables', 'data'],
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
    template: () => ({
      question: `How many paths are there through this program?`,
      hints: ['the flowchart lens might be helpful'],
    }),
    levels: [3],
  },

  {
    template: ({ code }) => {
      const codeLines = code
        .split('\n')
        .map((code, number) => ({ code, number }))
        .filter((line) => line.code.length !== 0);
      const randomLine = codeLines[(codeLines.length * Math.random()) | 0];
      return {
        question: `How would you read line ${randomLine.number} out loud?`,
        hints: [
          'https://en.wikipedia.org/wiki/List_of_typographical_symbols_and_punctuation_marks',
          'https://blog.codinghorror.com/ascii-pronunciation-rules-for-programmers/',
          'https://cogent.co/blog/the-importance-of-learning-to-read-code/',
        ],
      };
    },
    levels: [1],
  },

  // === functions ===
  {
    template: ({ node }) =>
      `There is a function call on line ${node.loc.start.line}:
- where is the function declared?
- What parameters does the function have?
- which arguments are passed to the function?`,
    features: ['functions'],
    nodeTypes: ['CallExpression'],
    levels: [1],
  },
];
