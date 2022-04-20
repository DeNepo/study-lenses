import { ask } from '../open-ended/ask.js';
import { generate } from '../multiple-choice/index.js';

// ----------------------------------

export const askOpenEnded = (code = '') => {
  const { hints, question } = ask(code);

  if (
    question.includes('no questions match') ||
    (ask.config.traces.ask && Math.random() > 0.9)
  ) {
    askMultipleChoice(code, ['VariableTrace']);
    return;
  }

  console.log('--- --- --- --- --- --- ---');

  if (Array.isArray(hints) && hints.length > 0) {
    console.groupCollapsed(
      // hints.length > 1 ? "hints" : "hint"
      question,
    );
    hints.forEach((hint) => console.log('-', hint));
    console.groupEnd();
  } else {
    console.log(question);
  }
  console.log('--- --- --- --- --- --- ---');

  if (ask.config.alert.ask) {
    let toAlert = question;
    if (Array.isArray(hints) && hints.length > 0) {
      toAlert += '\n\nhints:';

      hints.forEach((hint) => {
        toAlert += '\n- ' + hint;
      });
    }
    alert(toAlert);
  }
};

// ----------------------------------

export const askMultipleChoice = (code = '', types) => {
  types = types || generate.config.types;
  if (types.length === 0) {
    console.log('select a question type and try again');
    return;
  }

  console.log('--- --- --- --- --- --- ---');

  let qlcs = [];

  const nativeConsoleMethods = Object.entries(console);
  try {
    for (const key in console) {
      console[key] = () => {};
    }
    qlcs = generate(code, [{ count: 1, types }]);
  } finally {
    for (const entry of nativeConsoleMethods) {
      console[entry[0]] = entry[1];
    }
  }

  for (const qlc of qlcs) {
    console.log(`%c${qlc.question}`, 'font-weight: bold;');

    for (const option of qlc.options) {
      console.groupCollapsed(option.answer);
      console.log(option.info);
      console.groupEnd();
    }
    console.log('--- --- --- --- --- --- ---');
  }
};
