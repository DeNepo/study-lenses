
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


  const editorStuff = anEditor({ config, container: editorContainer })
  editorStuff.editor.layout()

  editorStuff.editor.updateOptions({ readOnly: false })

  renderStudyButtons(studyButtons, config.locals, editorStuff.editor)


  formatCodeButton.addEventListener('click', editorStuff.handlers.format)

  resetCodeButton.addEventListener('click', editorStuff.handlers.reset)


  parsonizeSelectionButton.addEventListener('click',
    () => studySelection('parsons', editorStuff.editor, config.locals))

  diffSelectionButton.addEventListener('click',
    () => studySelection('diff-scramble', editorStuff.editor))


  return {
    editorStuff,
    controlPanel
  }
}

const renderStudyButtons = (container, config, editor) => {


  if (config.loopGuard) {

    if (typeof config.loopGuard !== 'object') {
      config.loopGuard = {
        active: true,
        max: 20
      }
    }

    const withLoopGuard = document.createElement('input')
    withLoopGuard.setAttribute('type', 'checkbox')
    withLoopGuard.checked = config.loopGuard.active
    withLoopGuard.onchange = () => config.loopGuard.active = !config.loopGuard.active

    const loopGuardInput = document.createElement('input')
    loopGuardInput.value = config.loopGuard.max
    loopGuardInput.name = 'max'
    loopGuardInput.style = 'width:3em'
    loopGuardInput.onchange = () => config.loopGuard.max = Number(loopGuardInput.value)

    const loopGuardForm = document.createElement('form')
    loopGuardForm.style = 'display:inline-block'
    loopGuardForm.appendChild(withLoopGuard)
    loopGuardForm.appendChild(document.createTextNode('loop guard: '))
    loopGuardForm.appendChild(loopGuardInput)

    container.appendChild(loopGuardForm)

  }

  if (config.flowchart) {

    const flowchartButton = document.createElement('button')
    flowchartButton.innerHTML = 'flowchart'
    flowchartButton.onclick = () => {
      const lenseConfig = {
        code: editor.getValue(),
        ext: config.ext
      }
      const queryValue = encodeURIComponent(JSON.stringify(lenseConfig))
      const query = `?flowchart=${queryValue}`
      const url = window.location.origin + query

      window.open(url, '_blank')
    }
    container.appendChild(document.createTextNode(' || '))
    container.appendChild(flowchartButton)

  }

  if (config.eval) {
    container.appendChild(document.createElement('br'))

    const consoleButton = document.createElement('button')
    consoleButton.innerHTML = 'console'
    consoleButton.onclick = () => studyWith['console']
    container.appendChild(consoleButton)

    const debuggerButton = document.createElement('button')
    debuggerButton.innerHTML = 'debugger'
    debuggerButton.onclick = () => studyWith['debugger']
    container.appendChild(debuggerButton)
  }

  if (config.openIn) {
    const openable = [
      'jsTutor',
      'loupe',
      'promisees',
      'esprima',
    ]


    const openInContainer = document.createElement('div')
    openInContainer.style = 'display: inline'
    const button = document.createElement('button')
    button.innerHTML = 'open in:'
    button.onclick = () => studyWith[select.value]
    openInContainer.appendChild(button)

    const select = document.createElement('select')
    select.name = 'activeViztool'
    for (const viztool of openable) {
      const option = document.createElement('option')
      option.innerHTML = viztool
      option.value = viztool
      if (config.openIn === viztool) {
        option.selected = 'selected'
      }
      select.appendChild(option)
    }
    openInContainer.appendChild(select)

    container.appendChild(document.createTextNode(' || '))
    container.appendChild(openInContainer)
  }


  const insertLoopGuards = (code, maxIterations) => {
    let loopNum = 0
    return code.replace(/for *\(.*\{|while *\(.*\{|do *\{/g, loopHead => {
      const id = ++loopNum
      return `let loopGuard_${id} = 0\n${loopHead}\nif (++loopGuard_${id} > ${maxIterations}) { throw new Error('Loop ${id} exceeded ${maxIterations} iterations') }\n`
    })
  }



  const studyWith = new Proxy({
    console: function (code) {
      const execute = eval
      execute(code)
    },
    debugger: function (code) {
      const stepThrough = eval
      const debuggered = "debugger // injected by LiveStudy\n\n" + code
      stepThrough(debuggered)
    },
    jsTutor: function (code) {
      const encodedJST = encodeURIComponent(code)
      const sanitizedJST = this.utils.sanitize(encodedJST)
      const jsTutorURL = "http://www.pythontutor.com/live.html#code=" + sanitizedJST + "&cumulative=false&curInstr=2&heapPrimitives=false&mode=display&origin=opt-live.js&py=js&rawInputLstJSON=%5B%5D&textReferences=false"
      window.open(jsTutorURL, '_blank')
    },
    loupe: function (code) {
      const encoded = encodeURIComponent(btoa(code))
      const loupeURL = "http://latentflip.com/loupe/?code=" + encoded + "!!!"
      window.open(loupeURL, '_blank')
    },
    promisees: function (code) {
      const encoded = encodeURIComponent(code).replace(/%20/g, '+')
      const URL = "https://bevacqua.github.io/promisees/#code=" + encoded
      window.open(URL, '_blank')
    },
    esprima: function (code) {
      const encoded = encodeURIComponent(code)
      const URL = 'https://esprima.org/demo/parse.html?code=' + encoded
      window.open(URL, '_blank')
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
  }, {
    get: async function (target, keyName, _) {
      const title = `====  ${keyName}  ====`
      const padding = Array.from(title).map(() => '-').join('')
      console.log(`%c\n\n${padding}\n${title}\n${padding}\n`, 'font-weight:bold')


      if (config.loopGuard && config.loopGuard.active) {
        // using xhr so any errors aren't "in promise"
        const xhr = new XMLHttpRequest();
        const paramConfig = {
          code: insertLoopGuards(strip(editor.getValue()), config.loopGuard.max),
          ext: config.ext
        }
        const paramSafeConfig = encodeURIComponent(JSON.stringify(paramConfig))
        xhr.open('GET', window.location.origin + '?format=' + paramSafeConfig);
        xhr.responseType = 'text';
        xhr.send();
        xhr.onload = () => {
          if (xhr.status != 200) {
            console.error(`${xhr.status}: ${xhr.statusText}`);
          } else {
            const formattedCode = xhr.response;
            target[keyName](formattedCode)
          }
        }
        xhr.onerror = function (err) {
          console.error(err);
        }
      } else {
        target[keyName](editor.getValue())
      }

    }
  })



}


