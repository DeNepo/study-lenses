// enable loop guard for integrate

const initLiveStudy = (
  config,
  controlPanel = document.createElement('div'),
  editorContainer = document.createElement('div'),
) => {


  // editorContainer.style.height = (config.code.split('\n').length * 1.5) + 'em';
  controlPanel.innerHTML = `
    <button>format code</button>
    <button>reset code</button> ||
    <button>parsonize selection</button>
    <button>diff selection</button>
    <br><br>
    <button>open in new tab</button>`;

  const formatCodeButton = controlPanel.children[0];
  const resetCodeButton = controlPanel.children[1];
  const parsonizeSelectionButton = controlPanel.children[4];
  const diffSelectionButton = controlPanel.children[5];
  const newTabButton = controlPanel.children[6];

  config.editorWidth = '60%'
  const editorStuff = anEditor({ config, container: editorContainer });
  editorStuff.editor.layout();

  const outputContainer = document.getElementById('output-container')
  const outputHandler = () => {
    const iframe = document.createElement('iframe')
    iframe.style = 'height: 100%; width: 100%;'
    iframe.onload = () => {
      iframe.contentDocument.open();
      iframe.contentDocument.write(editorStuff.editor.getValue());
      iframe.contentDocument.close();
    }

    outputContainer.innerHTML = ''
    outputContainer.appendChild(iframe)
  }
  outputHandler()
  const debouncedHandler = debounce(outputHandler, 500)
  editorStuff.editor.onDidChangeModelContent(debouncedHandler);

  editorStuff.editor.updateOptions({ readOnly: false })

  formatCodeButton.addEventListener('click', () =>
    editorStuff.editor.trigger('anyString', 'editor.action.formatDocument'));

  resetCodeButton.addEventListener('click', editorStuff.handlers.reset);

  parsonizeSelectionButton.addEventListener('click',
    () => studySelection('parsons', editorStuff.editor, { ext: '.html' }));

  diffSelectionButton.addEventListener('click',
    () => studySelection('diff-scramble', editorStuff.editor));

  newTabButton.addEventListener('click', () => {
    const x = window.open();
    x.document.open();
    x.document.write(editorStuff.editor.getValue());
    x.document.close();
  })

  return {
    editorStuff,
    controlPanel
  };
};

