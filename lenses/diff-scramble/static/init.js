
const init = (codeArgument) => {

  const code = codeArgument || config.code

  const language = monacoExtToLanguage[config.ext]


  let commentless = strip(code).replace(new RegExp('(\n){2,}', 'gim'), '\n\n').trim();
  if (commentless[commentless.length - 1] === '\n') {
    commentless = commentless.slice(0, commentless.length - 1);
  }

  const toScramble = monaco.editor.createModel(commentless, language);
  // const toScramble = monaco.editor.createModel(recompose(decompose(code)), language);
  toScramble.updateOptions({ tabSize: 2 });
  const source = monaco.editor.createModel(commentless, language);
  // const source = monaco.editor.createModel(code, language);
  source.updateOptions({ tabSize: 2 });

  const diffContainer = document.getElementById('editor-container')
  diffContainer.innerHTML = ''
  const diffEditor = monaco.editor.createDiffEditor(diffContainer, {
    roundedSelection: true,
    scrollBeyondLastLine: false,
    theme: "vs-dark",
    wrappingIndent: "indent",
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
    modified: source
  });

  diffEditor.style = 'height:90vh; width:100vw;';



  document.getElementById('diff-selection-form').onchange = (event) => {
    const inputs = Array.from(event.currentTarget.getElementsByTagName('input'));

    const nonZeroInputs = inputs.filter(input => input.value !== '0');

    const scale = (value) => Math.pow(100, (value / 200)) / 10;
    // subset, mixer, percentage
    const mixupParameters = nonZeroInputs.map(input => {
      const splitName = input.name.split('-');
      return [splitName[0], splitName[1], scale(Number(input.value))];
    });

    const transformations = mixupParameters.map(parameter => {
      const mixitup = mangler[parameter[0]];
      if (parameter[1] === 'shuffle') {
        return mixitup(shuffle, parameter[2]);
      } else {
        return mixitup(replace, parameter[2]);
      }
    });

    // const log = (thing) => (console.log(thing), thing);
    const log = (thing) => thing;
    toScramble.setValue(recompose(log(pipe(log(decompose(commentless)), transformations))));

  }

}


document.getElementById('randomize-variables').onchange = (event) => {
  const input = event.target

  const newCode = randomizeVariables(config.code, Number(input.value) / 100);

  init(newCode)
}
