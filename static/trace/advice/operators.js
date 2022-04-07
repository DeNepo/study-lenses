import { config } from '../data/config.js';
import { state } from '../data/state.js';
import { isInRange } from '../lib/is-in-range.js';
import { print } from '../lib/trace-log.js';

const nativeConsole = console;

export default {
  unary: (operator, value, serial) => {
    const result = state.aran.unary(operator, value);

    state.node = state.aran.nodes[serial];
    if (!isInRange(state.node)) {
      return result;
    }

    // META.unary("!", $x, @serial)

    if (
      config.operatorsList.length !== 0 &&
      !config.operatorsList.includes(operator)
    ) {
      return result;
    }

    // if (!state.inNativeCallstack || state.inConsoleCall) {
    if (!state.inNativeCallstack) {
      const line = state.node.loc.start.line;
      const col = state.node.loc.start.column;
      print({
        prefix: [line, col],
        logs: ['operation (' + operator + ' _):', operator, value],
        style: 'font-weight: bold;',
        out: nativeConsole.groupCollapsed,
      });
      print({ logs: ['(evaluates to):', result] });
      nativeConsole.groupEnd();
    }
    // nativeConsole.log(state.node);
    return result;
  },
  binary: (operator, left, right, serial) => {
    const result = state.aran.binary(operator, left, right);
    // META.binary("+", $x, $y, @serial)
    state.node = state.aran.nodes[serial];
    if (!isInRange(state.node)) {
      return result;
    }

    if (
      config.operatorsList.length !== 0 &&
      !config.operatorsList.includes(operator)
    ) {
      return result;
    }

    // if (!state.inNativeCallstack || state.inConsoleCall) {
    if (!state.inNativeCallstack) {
      const line = state.node.loc.start.line;
      const col = state.node.loc.start.column;
      print({
        prefix: [line, col],
        logs: ['operation (_ ' + operator + ' _):', left, operator, right],
        style: 'font-weight: bold;',
        out: nativeConsole.groupCollapsed,
      });
      print({ logs: ['(evaluates to):', result] });
      nativeConsole.groupEnd();
    }
    // nativeConsole.log(state.node);
    return result;
  },
};
