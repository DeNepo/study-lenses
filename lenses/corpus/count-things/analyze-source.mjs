import { parse } from 'acorn';
import { walk } from 'estree-walker';

export const analyzeSource = (code = '') => {
  const report = {};

  const finalCode = code.startsWith('#!')
    ? (() => {
        const splitfinalCode = code.split('\n');
        report.hashBang = splitfinalCode.shift();
        return splitfinalCode.join('\n');
      })()
    : code;

  const lines = {
    total: code.split('\n').length,
    lengths: Object.fromEntries(
      Object.entries(
        code.split('\n').reduce((all, next) => {
          if (typeof all[next.length] === 'number') {
            all[next.length]++;
          } else {
            all[next.length] = 1;
          }
          return all;
        }, {}),
      ).sort((a, b) => b[1] - a[1]),
    ),
  };

  const parseConfig = {
    sourceType: 'script',
    ecmaVersion: 2021,
    onComment: [],
    allowAwaitOutsideFunction: true,
    // locations: true,
    // allowHashBang: true,
    // program: ...,
  };

  let tree;
  try {
    tree = parse(finalCode, parseConfig);
  } catch (err) {
    // console.error(err);

    if (err.message.includes('module')) {
      try {
        parseConfig.sourceType = 'module';
        parseConfig.onComment = [];

        tree = parse(finalCode, parseConfig);
      } catch (err) {
        return {
          parseError: {
            name: err.name,
            message: err.message.replace(/\(\d+:\d+\)/, '').trim(),
            location: err.message.match(/\d+:\d+/)[0],
          },
          lines,
        };
      }
    } else {
      return {
        parseError: {
          name: err.name,
          message: err.message.replace(/\(\d+:\d+\)/, '').trim(),
          location: err.message.match(/\d+:\d+/)[0],
        },
        lines,
      };
    }
  }

  report.type = parseConfig.sourceType;

  const nodeTypes = {};
  const directives = {};
  const identifiers = {};
  const literals = {};
  const variables = {};
  walk(tree, {
    enter(node, parent, prop, index) {
      if (typeof nodeTypes[node.type] === 'number') {
        nodeTypes[node.type]++;
      } else {
        nodeTypes[node.type] = 1;
      }

      if (node.directive) {
        typeof directives[node.expression.value] === 'number'
          ? directives[node.expression.value]++
          : (directives[node.expression.value] = 1);
      }
      if (node.type === 'Identifier') {
        typeof identifiers[node.name] === 'number'
          ? identifiers[node.name]++
          : (identifiers[node.name] = 1);
      }
      if (node.type === 'Literal') {
        const literalKey = node.regex
          ? 'regex'
          : node.value === null
          ? 'null'
          : typeof node.value;

        typeof literals[literalKey] === 'number'
          ? literals[literalKey]++
          : (literals[literalKey] = 1);
      }
      if (node.type === 'VariableDeclarator') {
        const variableName = node.id.name;
        typeof variables[variableName] === 'number'
          ? variables[variableName]++
          : (variables[variableName] = 1);
      }
    },
  });

  if (Object.keys(directives).length !== 0) {
    report.directives = directives;
  }

  if (parseConfig.onComment.length > 0) {
    const comments = {
      line: 0,
      block: 0,
      jsdoc: 0,
    };
    for (const comment of parseConfig.onComment) {
      if (comment.type === 'Line') {
        comments.line++;
      } else if (comment.value[0] === '*') {
        comments.jsdoc++;
      } else {
        comments.block++;
      }
    }

    report.comments = Object.fromEntries(
      Object.entries(comments).filter((commentType) => commentType[1] !== 0),
    );
  }

  report.lines = lines;

  if (Object.keys(nodeTypes).length !== 0) {
    report.nodeTypes = Object.fromEntries(
      Object.entries(nodeTypes).sort((a, b) => b[1] - a[1]),
    );
  }

  if (Object.keys(identifiers).length !== 0) {
    report.identifiers = Object.fromEntries(
      Object.entries(identifiers).sort((a, b) => b[1] - a[1]),
    );
  }

  if (Object.keys(literals).length !== 0) {
    report.literals = Object.fromEntries(
      Object.entries(literals).sort((a, b) => b[1] - a[1]),
    );
  }

  if (Object.keys(variables).length !== 0) {
    report.variables = Object.fromEntries(
      Object.entries(variables).sort((a, b) => b[1] - a[1]),
    );
  }

  return Object.fromEntries(Object.entries(report));
};
