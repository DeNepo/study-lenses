
const initLiveStudy = (
  config,
  controlPanel = document.createElement('div'),
  editorContainer = document.createElement('div'),
) => {

  // editorContainer.style.height = (config.code.split('\n').length * 1.5) + 'em';
  controlPanel.innerHTML = `<input type='checkbox' checked='true' /> read-only
    <button style="display: none;">format code</button>
    <button style="display: none;">reset code</button>
    <button style="display: none;">save</button>
    <br>
    <br>
    <button>parsonize selection</button>
    <button>diff selection</button>`;

  const readOnlyInput = controlPanel.children[0];
  const formatCodeButton = controlPanel.children[1];
  const resetCodeButton = controlPanel.children[2];
  const saveButton = controlPanel.children[3];
  const parsonizeSelectionButton = controlPanel.children[6];
  const diffSelectionButton = controlPanel.children[7];

  const editorStuff = anEditor({ config, container: editorContainer });
  editorStuff.editor.layout();

  let onceToggled = false;
  readOnlyInput.addEventListener('click', (event) => {
    if (!onceToggled) {
      onceToggled = true;
      formatCodeButton.style.display = "inline";
      resetCodeButton.style.display = "inline";
      if (config.editor && config.editor.save) {
        saveButton.style.display = "inline";
      }
    }
    editorStuff.handlers.toggleReadOnly(event);
  });

  formatCodeButton.addEventListener('click', editorStuff.handlers.format);

  resetCodeButton.addEventListener('click', editorStuff.handlers.reset);

  saveButton.addEventListener('click', editorStuff.handlers.save);

  parsonizeSelectionButton.addEventListener('click',
    () => studySelection('parsons', editorStuff.editor));

  diffSelectionButton.addEventListener('click',
    () => studySelection('diff-scramble', editorStuff.editor));


  return {
    editorStuff,
    controlPanel
  };
};

