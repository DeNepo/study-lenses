const initLiveStudy = (
  config,
  controlPanel = document.createElement('div'),
  editorContainer = document.createElement('div'),
) => {

  // editorContainer.style.height = (config.code.split('\n').length * 1.5) + 'em'
  controlPanel.innerHTML = `<button>format code</button>
    <button>reset code</button> || <button>parsonize selection</button>
    <button>diff selection</button>
    <br>
    <br>
    <div></div>`

  const formatCodeButton = controlPanel.children[0]
  const resetCodeButton = controlPanel.children[1]
  const parsonizeSelectionButton = controlPanel.children[2]
  const diffSelectionButton = controlPanel.children[3]
  const studyButtons = controlPanel.children[6]


  config.editorWidth = '50vw'
  const editorStuff = anEditor({ config, container: editorContainer })
  editorStuff.editor.layout()

  editorStuff.editor.updateOptions({ readOnly: false })


  const resetButton = document.createElement('button')
  resetButton.innerHTML = 'reset'
  resetButton.onclick = () => setupHandler()
  studyButtons.appendChild(resetButton)



  const stopButton = document.createElement('button')
  stopButton.innerHTML = 'pause'
  stopButton.onclick = () => noLoop()
  studyButtons.appendChild(stopButton)

  const startButton = document.createElement('button')
  startButton.innerHTML = 'play'
  startButton.onclick = () => {
    loop()
  }
  studyButtons.appendChild(startButton)


  // renderStudyButtons(studyButtons, config.locals, editorStuff.editor)

  // let didChange = false
  const setupHandler = () => {
    // didChange = false
    // if (!initialized) { initialized = true }
    const execute = eval
    execute(editorStuff.editor.getValue())
    setup()
  }
  // setupHandler()
  const debouncedHandler = debounce(setupHandler, 500)

  setTimeout(setupHandler, 500)

  const liveRefreshCheckbox = document.createElement('input')
  liveRefreshCheckbox.type = 'checkbox'
  let isLiveRefresh = false
  liveRefreshCheckbox.onchange = () => {
    console.log(isLiveRefresh)
    if (isLiveRefresh) {
      console.log(1)
      editorStuff.editor.onDidChangeModelContent(() => {
        // didChange = true
      });
    } else {
      console.log(2)
      editorStuff.editor.onDidChangeModelContent(debouncedHandler);
    }
    isLiveRefresh = !isLiveRefresh
  }
  studyButtons.appendChild(document.createTextNode('  live refresh'))
  studyButtons.appendChild(liveRefreshCheckbox)


  formatCodeButton.addEventListener('click', editorStuff.handlers.format)

  resetCodeButton.addEventListener('click', editorStuff.handlers.reset)


  parsonizeSelectionButton.addEventListener('click',
    () => studySelection('parsons', editorStuff.editor, { ext: '.js' }))

  diffSelectionButton.addEventListener('click',
    () => studySelection('diff-scramble', editorStuff.editor))


  return {
    editorStuff,
    controlPanel
  }
}
