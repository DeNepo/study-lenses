import { state } from '../data/state.js';
import { config } from '../data/config.js';
import { deepClone } from './deep-clone.js';

const nativeConsole = console;

const linePrefix = (line, col = null) => {
  const stepNumber = state.loggedSteps || 0;
  if (state.loggedSteps !== 0) {
    state.loggedSteps += 1;
  }

  let prefix = '';

  // const scopeDepth = Array(state.scopes.length + 1).join("  ");
  // prefix = scopeDepth + prefix;

  if (config.lines) {
    const lineNumberString = line < 10 ? ' ' + line : '' + line;
    const colNumberString = col < 10 ? col + ' ' : '' + col;
    prefix =
      `line ${lineNumberString}:${
        typeof col === 'number' ? colNumberString : ''
      } -` + prefix;
    // prefix = `line${lineNumberString} -` + prefix;
  }

  if (config.steps) {
    const stepNumberString =
      stepNumber < 10 ? ' ' + stepNumber : '' + stepNumber;
    prefix = `${stepNumberString}. ` + prefix;
  }

  return '%c' + prefix;
};

export const print = ({
  logs = [],
  prefix,
  out = nativeConsole.log,
  style = '',
  overrideBuiltIn,
}) => {
  if (state.builtInEntryPoint && !overrideBuiltIn) {
    return;
  }

  logs = logs
    .map((thing) =>
      thing &&
      thing.__proto__ &&
      typeof thing.__proto__.name === 'string' &&
      thing.__proto__.name.includes('Error')
        ? thing.name
        : thing,
    )
    .map((thing) =>
      typeof thing === 'function'
        ? 'a function named "' + thing.name + '"'
        : deepClone(thing),
    );

  // console.log(logs);
  const tabbing = config.blockScope
    ? [].fill('  ', 0, state.blockScopeDepth).join('  ')
    : '';

  if (tabbing) {
    logs.unshift(tabbing);
  }

  if (typeof prefix === 'number') {
    out(linePrefix(prefix), style, ...logs);
  } else if (Array.isArray(prefix)) {
    out(linePrefix(...prefix), style, ...logs);
  } else if (typeof prefix === 'string') {
    out('%c' + prefix, style, ...logs);
  } else if (typeof prefix === 'function') {
    const finalPrefix = prefix(linePrefix);
    out(finalPrefix, style, ...logs);
  } else {
    out(...logs);
  }
};
