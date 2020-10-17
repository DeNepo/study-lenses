
const initLiveStudy = (
  config,
  controlPanel = document.createElement('div'),
  editorContainer = document.createElement('div'),
) => {

  // editorContainer.style.height = (config.code.split('\n').length * 1.5) + 'em';
  controlPanel.innerHTML = `<button>format code</button>
    <button>reset code</button> || <button>parsonize selection</button>
    <button>diff selection</button>
    <br>
    <br>
    <div></div>`;

  const formatCodeButton = controlPanel.children[0];
  const resetCodeButton = controlPanel.children[1];
  const parsonizeSelectionButton = controlPanel.children[2];
  const diffSelectionButton = controlPanel.children[3];
  const studyButtons = controlPanel.children[6];


  const editorStuff = anEditor({ config, container: editorContainer });
  editorStuff.editor.layout();

  editorStuff.editor.updateOptions({ readOnly: false })

  renderStudyButtons(studyButtons, config, editorStuff.editor)


  formatCodeButton.addEventListener('click', editorStuff.handlers.format);

  resetCodeButton.addEventListener('click', editorStuff.handlers.reset);


  parsonizeSelectionButton.addEventListener('click',
    () => studySelection('parsons', editorStuff.editor));

  diffSelectionButton.addEventListener('click',
    () => studySelection('diff-scramble', editorStuff.editor));


  return {
    editorStuff,
    controlPanel
  };
};

const renderStudyButtons = (container, config, editor) => {


  if (config.eval) {
    const consoleButton = document.createElement('button')
    consoleButton.innerHTML = 'console'
    consoleButton.onclick = () => studyWith(editor.getValue(), 'console')
    container.appendChild(consoleButton)

    const debuggerButton = document.createElement('button')
    debuggerButton.innerHTML = 'debugger'
    debuggerButton.onclick = () => studyWith(editor.getValue(), 'debugger')
    container.appendChild(debuggerButton)
  }

  if (config.openIn) {
    const openInButton = document.createElement('button')
    openInButton.innerHTML = 'open in'
    openInButton.onclick = () => studyWith(editor.getValue(), 'debugger')
    container.appendChild(openInButton)
  }

  if (config.loopGuard && config.eval) {
    Exercise.insertLoopGuards = (code, maxIterations) => {
      let loopNum = 0;
      return code.replace(/for *\(.*\{|while *\(.*\{|do *\{/g, loopHead => {
        const id = ++loopNum;
        return `let loopGuard${id} = 0;\n${loopHead}\nif (++loopGuard${id} > ${maxIterations}) { throw new Error('Loop exceeded ${maxIterations} iterations'); }\n`
      });
    }
    if (loopGuard.active) {
      const unFormatted = Exercise.insertLoopGuards(code, loopGuard.max);

      const preLoop = editor.getValue();
      editor.getModel().setValue(unFormatted)
      editor.trigger('anyString', 'editor.action.formatDocument');
      setTimeout(() => {
        code = editor.getValue();
        editor.setValue(preLoop);
        studyIn[vizTool](code);
      }, 1000);
    } else {
      studyIn[vizTool](code);
    };


  }

}





const studyWith = {
  console: function (code) {
    const execute = eval;
    execute(code);
  },
  debugger: function (code) {
    const stepThrough = eval;
    const debuggered = "debugger; // injected by LiveStudy\n\n" + code;
    stepThrough(debuggered);
  },
  jsTutor: function (code) {
    const encodedJST = encodeURIComponent(code);
    const sanitizedJST = this.utils.sanitize(encodedJST);
    const jsTutorURL = "http://www.pythontutor.com/live.html#code=" + sanitizedJST + "&cumulative=false&curInstr=2&heapPrimitives=false&mode=display&origin=opt-live.js&py=js&rawInputLstJSON=%5B%5D&textReferences=false";
    window.open(jsTutorURL, '_blank');
  },
  loupe: function (code) {
    const encoded = encodeURIComponent(btoa(code));
    const loupeURL = "http://latentflip.com/loupe/?code=" + encoded + "!!!"
    window.open(loupeURL, '_blank');
  },
  promisees: function (code) {
    const encoded = encodeURIComponent(code).replace(/%20/g, '+');
    const URL = "https://bevacqua.github.io/promisees/#code=" + encoded;
    window.open(URL, '_blank');
  },
  esprima: function (code) {
    const encoded = encodeURIComponent(code);
    const URL = 'https://esprima.org/demo/parse.html?code=' + encoded;
    window.open(URL, '_blank');
  },
  flowchart: function (code) {
    const lenseConfig = {
      code,
      ext: '.js'
    }
    const queryValue = encodeURIComponent(JSON.stringify(lenseConfig))
    const query = `?${queryKey}=${queryValue}`
    const url = window.location.origin + query
    window.open(url, '_blank')
  },
  utils: {
    sanitize: (str) => str
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/%09/g, '%20%20'),
    // large code, to be initialized when needed. ie. babel
    compressToBase64: null,
  }
};
