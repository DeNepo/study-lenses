import { config } from '../data/config.js';
import { print } from '../lib/trace-log.js';
import { state } from '../data/state.js';

import { isInRange } from '../lib/is-in-range.js';

const nativeConsole = console;

/* ++, --

  - normalization always stars with a read
  check if state.node is an update
  then update state
  also check if operators are enabled

  state: add something
    - in an update or not

  questions, does it point to

------

if tacing operators & variables is enabled

  4. line 3:2 - operator (_++): variable++
    read variable: 3
    operator (+): 3 + 1
      evaluates to: 4
    assign variable: 4
    evaluates to: 3



if only tracing variables

  read variable: 3
  assign variable: 4



if only operators

  4. line 3:2 - operator (_++): variable++
    operator (+): 3 + 1
      evaluates to: 4
    evaluates to: 3

----

dirty hack:
  first trap is read
  he will have an associated state.node
    is that state.node the identifier or update expression?
  set it in state

  possible ending traps
    read, write, apply
    need to check for leaving UpdateExpression in these

  at leaving every read/write/apply
    if state.updateExpression !== null
      go recursively thorugh the update
      if  the current state.node is not a child of the update
        set it to null



*/

let lastFuncDecStep = 0;
let lastFuncDec = null;

export default {
  read: (value, variable, serial) => {
    state.node = state.aran.nodes[serial];

    if (!isInRange(state.node)) {
      return value;
    }
    // nativeConsole.log(1);
    // nativeConsole.log(state.node);

    if (!config.variablesRead) {
      return value;
    }
    // nativeConsole.log(2);
    if (
      config.variablesList.length !== 0 &&
      // !config.variablesList.find((query) => new RegExp(query).test(variable))
      !config.variablesList.includes(variable)
    ) {
      return value;
    }
    // nativeConsole.log(3);
    // because aran encodes generated variables as number strings
    if (!isNaN(variable)) {
      return value;
    }

    // if (state.inNativeCallstack && !state.inConsoleCall) {
    if (state.inNativeCallstack) {
      return value;
    }

    // nativeConsole.log(4);
    const line = state.node.loc.start.line;
    const col = state.node.loc.start.column;
    print({
      prefix: [line, col],
      logs: [
        (state.node.left ? state.node.left.name : variable) + ' (read):',
        value,
      ],
    });
    // nativeConsole.log("value:", value);
    // nativeConsole.log("variable:", variable);
    // nativeConsole.log("serial:", serial);
    // nativeConsole.log("state.node:", state.node);
    return value;
  },
  write: (value, variable, serial) => {
    state.node = state.aran.nodes[serial];

    // if (state.node.type === "FunctionDeclaration") {
    //   nativeConsole.log(state.node);
    // }

    if (!isInRange(state.node)) {
      return value;
    }
    // nativeConsole.log(state.node);

    if (!(config.variablesAssign || config.variablesDeclare)) {
      return value;
    }

    if (
      config.variablesList.length !== 0 &&
      // !config.variablesList.find((query) => new RegExp(query).test(variable))
      !config.variablesList.includes(variable)
    ) {
      return value;
    }

    // if (state.inNativeCallstack && !state.inConsoleCall) {
    if (state.inNativeCallstack) {
      return value;
    }

    // because aran encodes generated variables as number strings
    if (!isNaN(variable)) {
      return value;
    }
    const line = state.node.loc.start.line;
    const col = state.node.loc.start.column;

    if (
      (state.node.type === 'ForOfStatement' ||
        state.node.type === 'ForInStatement') &&
      config.variablesDeclare
    ) {
      const kind = state.node.left.kind;
      const focusedLine = state.node.left.loc.start.line;
      const focusedCol = state.node.left.loc.start.column;

      if (kind !== 'var') {
        print({
          prefix: [focusedLine, focusedCol],
          logs: [variable + ' (declare, ' + kind + ')'],
        });

        print({
          prefix: [focusedLine, focusedCol],
          logs: [
            variable +
              ' (' +
              (state.node.kind === 'var' ? 'assign' : 'initialize') +
              '):',
            value,
          ],
        });
      }
    } else if (
      (state.node.type === 'VariableDeclaration' ||
        state.node.type === 'VariableDeclarator') &&
      // || state.node.type === "ExpressionStatement"
      config.variablesDeclare
    ) {
      // if (state.hoisted.includes(state.node)) {
      //   return value;
      // }
      if (state.node.kind !== 'var') {
        print({
          prefix: [line, col],
          logs: [variable + ' (declare, ' + state.node.kind + ')'],
        });
      }

      const declarator = state.node.declarations.find(
        (declarator) => declarator.id.name === variable,
      );
      // nativeConsole.log(declarator);
      if (declarator.init) {
        const line = declarator.init.loc.start.line;
        const col = declarator.init.loc.start.column;
        print({
          prefix: [line, col],
          logs: [
            variable +
              ' (' +
              (state.node.kind === 'var' ? 'assign' : 'initialize') +
              '):',
            value,
          ],
        });
      }
    }
    // else if (
    //   state.node.type === "FunctionDeclaration" &&
    //   // || state.node.type === "ExpressionStatement"
    //   config.functionDeclarations
    // ) {
    //   if (
    //     lastFuncDecStep == state.loggedSteps - 1 &&
    //     lastFuncDec === state.node
    //   ) {
    //     return value;
    //   }

    //   lastFuncDecStep = state.loggedSteps;
    //   lastFuncDec = state.node;
    //   print({
    //     prefix: [line, col],
    //     logs: [variable + " (declare, function)"],
    //   });
    // }

    if (
      (state.node.type === 'AssignmentExpression' ||
        state.node.type === 'UpdateExpression' ||
        state.node.type === 'ExpressionStatement' ||
        state.node.type === 'ForStatement') &&
      config.variablesAssign
    ) {
      print({
        prefix: [line, col],
        logs: [variable + ' (assign):', value],
      });
    }
    return value;
  },
  enter: (tag, labels, variables, serial) => {
    // nativeConsole.log(tag, labels, variables, serial);
    if (tag !== 'loop') {
      return;
    }

    state.node = state.aran.nodes[serial];
    // nativeConsole.log(state.node);
    if (!isInRange(state.node)) {
      return;
    }

    if (
      state.node.type !== 'ForOfStatement' &&
      state.node.type !== 'ForInStatement'
    ) {
      return;
    }

    // nativeConsole.log(state.node);

    if (!config.variablesDeclare) {
      return;
    }

    const line = state.node.loc.start.line;
    const col = state.node.loc.start.column;
    for (const variable of variables) {
      if (!isNaN(variable)) {
        continue;
      }
      if (
        config.variablesList.length !== 0 &&
        // !config.variablesList.find((query) => new RegExp(query).test(variable))
        !config.variablesList.includes(variable)
      ) {
        continue;
      }
      print({
        prefix: [line, col],
        logs: [variable + ' (declare)'],
      });
    }
    // nativeConsole.log("value:", value);
    // nativeConsole.log("variable:", variable);
    // nativeConsole.log("serial:", serial);
    // nativeConsole.log("state.node:", state.node);
  },
};
