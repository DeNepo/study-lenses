import { generateTests } from './generate-tests.js';
import { percentPass } from './percent-pass.js';
import { runTests } from './run-tests.js';

import { format } from './format.js';

const fuzzPath = window.location.origin + window.location.pathname + '/fuzz.js';
const fuzz = await import(fuzzPath);

if (typeof fuzz.args !== 'function') {
  throw new TypeError('fuzz.args is not a function');
}

if (typeof fuzz.solution !== 'function') {
  throw new TypeError('fuzz.solution is not a function');
}

Object.assign(config, fuzz);

const tests = generateTests(config.args, config.solution, 100);

// runTests(config.solution, tests, true);

const passingness = percentPass(config.solution, tests);

// console.log(passingness);

if (passingness.passing !== 100) {
  throw new Error(
    `this exercise is broken. it failed ${passingness.failing.length} tests out of ${tests.length}`,
  );
}

if (config.jsDoc) {
  const docsContainer = document.getElementById('docs-container');
  docsContainer.style.display = 'block';

  docsContainer.innerHTML = `
    <hr>
    <details>
      <summary>JSDoc</summary>
      <pre class='language-jsdoc'><code>${config.jsDoc}</code><pre>
    </details>
  `;
}

const setupSolution = (solution) => {
  const solutionCode = format(solution.code);
  const model = monaco.editor.createModel(solutionCode, 'javascript');
  model.updateOptions({ tabSize: 2 });
  solution.model = model;
  return solution;
};
config.solutions.forEach(setupSolution);

config.theme = 'vs-dark';

config.editor = monaco.editor.create(
  document.getElementById('editor-container'),
  {
    language: 'javascript',
    roundedSelection: true,
    scrollBeyondLastLine: false,
    theme: config.theme,
    wrappingIndent: 'indent',
    wordWrap: 'wordWrapColumn',
    wordWrapColumn: 100,
    automaticLayout: true,
    tabSize: 2,
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    wrappingStrategy: 'advanced',
    minimap: {
      enabled: false,
    },
    overviewRulerLanes: 0,
  },
);

window.editor = config.editor;

// --- configure button to run the correct code ---

const runItButton = document.getElementById('run-it-button');

runItButton.code = async () => {
  const activeSolution = config.solutions.find((solution) => solution.active);

  if (!activeSolution) {
    alert(`no solution to fuzz!

click the [+] button to start a new solution`);
    return;
  }

  console.log('------------ ' + activeSolution.fileName + ' ------------');
  const solution = config.editor.getValue();
  const isExport = solution.includes('export const ' + activeSolution.name);
  // for backwards compatibility

  runItButton.config.globals = {
    describe,
    it,
    expect,
    generateTests,
    runTests,
    Error,
    EvalError,
    TypeError,
    RangeError,
    SyntaxError,
    ReferenceError,
  };
  const runnerCode = isExport
    ? `import { args, solution } from './${window.location.pathname
        .split('/')
        .pop()}/fuzz.js';
import { ${activeSolution.name} } from './${window.location.pathname
        .split('/')
        .pop()}/solutions/${activeSolution.fileName}'

const tests = generateTests(args, solution, 10);

runTests(${activeSolution.name}, tests);
`
    : `import { args, solution } from './${window.location.pathname.split(
        '/',
      )}/fuzz.js';


${solution}

const tests = generateTests(args, solution, 10);

runTests(${activeSolution.name}, tests);`;

  if (isExport) {
    await saveChanges(false)();
  }

  return runnerCode;
};

document.getElementById('lens-it-el').code = () => {
  const editorSelection = config.editor.getSelection();
  const editorSelectionEntries = Object.entries(editorSelection);
  const columnEntries = [];
  const lineEntries = [];
  for (const entry of editorSelectionEntries) {
    if (entry[0].includes('Column')) {
      columnEntries.push(entry);
    } else {
      lineEntries.push(entry);
    }
  }
  const firstLine = lineEntries[0][1];
  const firstColum = columnEntries[0][1];
  const noSelection =
    columnEntries.every((entry) => entry[1] === firstColum) &&
    lineEntries.every((entry) => entry[1] === firstLine);

  if (noSelection) {
    return config.editor.getValue();
  }

  let selection = '';
  const start = editorSelection.startLineNumber;
  const end = editorSelection.endLineNumber;
  const getFromThis =
    typeof config.editor.getModel === 'function'
      ? config.editor.getModel()
      : config.editor;
  for (let i = start; i <= end; i++) {
    selection += getFromThis.getLineContent(i) + '\n';
  }

  return selection;
};

if (document.getElementById('open-in-button')) {
  document.getElementById('open-in-button').code = () =>
    config.editor.getValue();
}

// --- setup alternate buttons ---

const solutionButtons = document.getElementById('solution-buttons');

solutionButtons.addEventListener('click', (event) => {
  const index = Number(event.target.id);
  const active = config.solutions[index];
  config.editor.setModel(active.model);
  Array.from(solutionButtons.children).forEach((button, buttonIndex) => {
    if (buttonIndex === index) {
      button.style.backgroundColor = 'black';
      button.style.color = 'white';
      config.solutions[buttonIndex].active = true;
    } else {
      button.style.backgroundColor = 'white';
      button.style.color = 'black';
      config.solutions[buttonIndex].active = false;
    }
  });
});

if (solutionButtons.children[0]) {
  solutionButtons.children[0].click();
} else {
  editor.setValue(`/*
  no solutions yet, click the [+] button up there to start a new one.
*/`);
}

// --- save changes ---

const saveChanges =
  (alertIt) =>
  (code = config.editor.getValue()) => {
    const solutionFileName = config.solutions.find(
      (solution) => solution.active,
    ).fileName;

    fetch(window.location.origin + window.location.pathname + '?fuzz', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: code,
        fileName: solutionFileName,
      }),
    })
      .then((response) => response.text())
      .then((message) => {
        alertIt ? alert(solutionFileName + ' ' + message) : null;
        console.log(solutionFileName + ' ' + message);
      })
      .catch((err) => {
        alert(err.name + ': ' + err.message);
        console.error('Error:', err);
      });
  };

if (config.locals.save === true) {
  document
    .getElementById('save-button')
    .addEventListener('click', saveChanges(true));
}

// --- add new solution ---

const fileNameRegex = /^(?!.*(?:\s))[\w\d-_.]*\.js$/g;

const createSolution = (fileName) => {
  const name = fileName
    .replace(/-./g, (x) => x[1].toUpperCase())
    .split('.js')
    .join('');

  return {
    code: `export const ${name} = () => {};`,
    fileName,
    name,
  };
};

const newSolutionButton = document.getElementById('new-solution-button');
newSolutionButton.addEventListener('click', (event) => {
  let fileName = '';
  while (!fileName) {
    const input = prompt('enter a file name for your new solution');
    if (input === null) {
      return;
    }

    if (!fileNameRegex.test(input)) {
      alert(`"${input}" is not a valid .js file name`);
      continue;
    }

    if (config.solutions.find((solution) => solution.fileName === input)) {
      alert(`"${input}" already exists, pick a new name`);
      continue;
    }

    fileName = input;
  }

  const buttonMaker = document.createElement('div');
  buttonMaker.innerHTML = `<button class='solution-button' id='${config.solutions.length}'>${fileName}</button>`;
  const newButton = buttonMaker.children[0];

  solutionButtons.appendChild(newButton);

  config.solutions.push(setupSolution(createSolution(fileName)));

  newButton.click();

  saveChanges(false)();
});

// --- format button ---

document.getElementById('format-button').addEventListener('click', () => {
  // https://github.com/react-monaco-editor/react-monaco-editor/pull/212
  config.editor.executeEdits('', [
    {
      range: config.editor.getModel().getFullModelRange(),
      text: format(config.editor.getValue()),
      // forceMoveMarkers: true
    },
  ]);
});
