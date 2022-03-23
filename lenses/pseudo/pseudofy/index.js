const Acorn = require('acorn');
const Astring = require('astring');

const { walk } = require('./estree-walker/index.js');

const pseudoGenerator = require('./pseudo-generator');

module.exports = (code = '', asComments = false) => {
  let tree = null;
  const comments = [];
  try {
    tree = Acorn.parse(code, { onComment: comments });
  } catch (err) {
    eval(code);
  }

  let pseudoCode = '';

  let isStrict = false;

  walk(tree, {
    enter(node, parent, prop, index) {
      if (node.directive && node.directive === 'use strict') {
        isStrict = true;
        this.remove();
      } else if (
        node.expression &&
        node.expression.type === 'CallExpression' &&
        node.expression.callee &&
        node.expression.callee.object &&
        node.expression.callee.object.name === 'console'
      ) {
        this.remove();
      } else if (
        node.type === 'CallExpression' &&
        node.callee &&
        node.callee.object &&
        node.callee.object.name === 'console'
      ) {
        this.remove();
      } else if (node.type === 'DebuggerStatement') {
        this.remove();
      }
    },
  });

  const customGenerator = Object.assign(
    {},
    Astring.baseGenerator,
    pseudoGenerator,
  );

  pseudoCode = Astring.generate(tree, {
    generator: customGenerator,
  });

  const splitPseudoCode = pseudoCode
    .split('\n')
    .filter((line) => line.trim() !== '');

  const finalPseudoCodeLines = [];
  for (let i = 0; i < splitPseudoCode.length; i++) {
    const line = splitPseudoCode[i];
    const nextLine = splitPseudoCode[i + 1];
    if (
      line &&
      nextLine &&
      !line.startsWith(' ') &&
      !nextLine.startsWith(' ')
    ) {
      finalPseudoCodeLines.push(line + '\n');
    } else {
      finalPseudoCodeLines.push(line);
    }
  }

  return (
    (isStrict && asComments ? "'use strict';\n\n" : '') +
    (asComments
      ? finalPseudoCodeLines.filter((line) => line).map((line) => '// ' + line)
      : finalPseudoCodeLines.filter((line) => line)
    ).join('\n')
  );
};
