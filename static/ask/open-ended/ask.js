import { state } from './state.js';
import { sortNodes } from './walking.js';
import { walk } from '../../estree-walker/index.js';
import { config as sharedConfig } from '../config.js';
import { randomQuestion } from './random-question/index.js';

const config = sharedConfig.openEnded;

const ask = (code) => {
  state.code = code;

  try {
    state.program = Acorn.parse(code, { locations: true });
  } catch (_) {
    console.log('%c-> creation phase error:', 'font-weight:bold;');
    eval(code);
    return;
  }

  state.nodes = {};
  walk(state.program, { leave: sortNodes(state.nodes) });

  for (const type in state.nodes) {
    // shuffle the nodes - https://stackoverflow.com/a/46545530
    state.nodes[type] = state.nodes[type]
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
  }
  // console.log(state.nodes);

  const question = randomQuestion(config, state);

  return question;
};

ask.config = config;

Object.freeze(ask);

export { ask };
