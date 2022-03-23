let onceRendered = false;
let codeLength = 0;
const init = (codeArgument) => {
  const rawCode = codeArgument || config.code;
  codeLength = rawCode.split('\n').length;

  const language = monacoExtToLanguage[config.ext];

  // extract all block comments, including leading or trailing white space
  //  so the lines of code maintain the correct indentation
  //  and so the block comments maintain their indentation in the UI
  const blockComments = rawCode.match(
    /[^\S\r\n]*\/\*([\S\s]*?)\*\/[^\S\r\n]*/gm,
  );

  let codeWithoutBlockComments = rawCode;
  // remove the captured block comments from the code and render to UI
  const blockCommentContainer = document.getElementById('block-comments');
  if (blockComments && !onceRendered) {
    onceRendered = true;
    for (const blockComment of blockComments) {
      if (!blockComment) {
        continue;
      }
      const commentPre = document.createElement('pre');
      commentPre.innerHTML = blockComment;
      blockCommentContainer.appendChild(commentPre);
    }
  }

  //  - register all distractor lines
  const distractorReplacer = '$_$_$_$_$_$_$_$_$_$_$_$';
  const distractorReplaced = codeWithoutBlockComments
    .replace(/\/\/[^\S\r\n]+distractor\s*$/gm, distractorReplacer)
    .replace(/\/\/distractor\s*$/gm, distractorReplacer);

  const finalCode = strip(distractorReplaced)
    .split(distractorReplacer)
    .join('// distractor');

  const toScramble = monaco.editor.createModel(finalCode, language);
  // const toScramble = monaco.editor.createModel(recompose(decompose(code)), language);
  toScramble.updateOptions({ tabSize: 2 });
  const source = monaco.editor.createModel(finalCode, language);
  // const source = monaco.editor.createModel(code, language);
  source.updateOptions({ tabSize: 2 });

  const diffContainer = document.getElementById('editor-container');
  diffContainer.innerHTML = '';
  const diffEditor = monaco.editor.createDiffEditor(diffContainer, {
    roundedSelection: true,
    scrollBeyondLastLine: false,
    theme: 'vs-dark',
    wrappingIndent: 'indent',
    wordWrap: 'wordWrapColumn',
    wordWrapColumn: 100,
    automaticLayout: true,
    originalEditable: true, // for left pane
    readOnly: true, // for right side
    enableSplitViewResizing: false,
    ignoreTrimWhitespace: false,
  });
  diffEditor.setModel({
    original: toScramble,
    modified: source,
  });

  diffEditor.style = 'height:90vh; width:100vw;';

  document.getElementById('diff-selection-form').onchange = (event) => {
    const inputs = Array.from(
      event.currentTarget.getElementsByTagName('input'),
    );

    const nonZeroInputs = inputs.filter((input) => input.value !== '0');

    // scales the probabilities based on snippet length
    const scale = (value) => Math.pow(100, value / 100) / (codeLength * 2);
    // subset, mixer, percentage
    const mixupParameters = nonZeroInputs.map((input) => {
      const splitName = input.name.split('-');
      return [splitName[0], splitName[1], scale(Number(input.value))];
    });

    const transformations = mixupParameters.map((parameter) => {
      const mixitup = mangler[parameter[0]];
      if (parameter[1] === 'shuffle') {
        return mixitup(shuffle, parameter[2]);
      } else {
        return mixitup(replace, parameter[2]);
      }
    });

    // const log = (thing) => (console.log(thing), thing);
    const log = (thing) => thing;
    toScramble.setValue(
      recompose(log(pipe(log(decompose(finalCode)), transformations))),
    );
  };
};

// if (config.ext === '.js') {
//   document.getElementById('randomize-variables').onchange = (event) => {
//     const input = event.target;

//     const newCode = randomizeVariables(config.code, Number(input.value) / 100);

//     init(newCode);
//   };
// }

document.getElementById('role').addEventListener('click', (event) => {
  const solutionEditor = document.getElementsByClassName('modified')[1];

  const showDiff = event.currentTarget.showDiff;

  if (showDiff.checked === true) {
    solutionEditor.style.display = 'inline-block';
  } else {
    solutionEditor.style.display = 'none';
  }
});

setTimeout(
  () => (document.getElementsByClassName('modified')[1].style.display = 'none'),
  0,
);
