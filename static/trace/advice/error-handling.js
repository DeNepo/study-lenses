import { config } from '../data/config.js';
import { state } from '../data/state.js';
import { isInRange } from '../lib/is-in-range.js';
import { print } from '../lib/trace-log.js';

const nativeConsole = console;

export default {
  error: (consumed, serial) => {
    state.node = state.aran.nodes[serial];
    if (!isInRange(state.node)) {
      return consumed;
    }

    const isNotInList =
      config.controlFlowList.length !== 0 &&
      !config.controlFlowList.includes('catch');
    if (isNotInList) {
      return consumed;
    }

    // nativeConsole.log(state.node);
    const line = state.node.handler.loc.start.line;
    const col = state.node.handler.loc.start.column;

    print({
      prefix: (linePrefix) => linePrefix(line, col) + ' catch:',
      logs: [consumed],
      style: 'font-weight: bold;',
    });

    return consumed;
  },
  throw: (consumed, serial) => {
    state.node = state.aran.nodes[serial];
    if (!isInRange(state.node)) {
      return consumed;
    }

    const isNotInList =
      config.controlFlowList.length !== 0 &&
      !config.controlFlowList.includes('throw');
    if (isNotInList) {
      return consumed;
    }

    if (state.node.type === 'Program') {
      return consumed;
    }

    const line = state.node.loc.start.line;
    const col = state.node.loc.start.column;

    print({
      prefix: (linePrefix) => linePrefix(line, col) + ' throw:',
      logs: [consumed],
      style: 'font-weight: bold;',
    });

    return consumed;
  },
};
