import { CodeFE } from '../code/code-class.js'
import { studyWith } from './lib/study-with.js'

export class JavaScriptFE extends CodeFE {

  constructor(config) {
    super(config)
    this.initJsUi()
  }


  initJsUi() {
    // if (this.config.locals.loopGuard) {
    const loopGuardForm = document.getElementById('loop-guard-form')
    let lastActiveValue = this.config.locals.loopGuard.active
    document.getElementById('loop-guard-input')
      .addEventListener('change', (event) => {
        if (event.target.checked) {
          this.config.locals.loopGuard.active = lastActiveValue
          loopGuardForm.style = 'display: inline-block;'
        } else {
          lastActiveValue = this.config.locals.loopGuard.active
          this.config.locals.loopGuard.active = false
          loopGuardForm.style = 'display: none;'
        }
      })
    loopGuardForm.addEventListener('change', (event) => {
      this.config.locals.loopGuard.active = event.target.form.active.checked
      this.config.locals.loopGuard.max = Number(event.target.form.max.value)
    })
    // }

    // if (this.config.locals.clearScheduled) {
    const clearAllScheduledFactory = () => {
      // timeout & interval share a pool of ids
      // clearTimeout will also clear intervals, and vice-versa
      // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout#Return_value
      let minId = setTimeout(() => { }, 0)
      return () => {
        const maxId = setTimeout(() => { }, 0)
        for (let i = minId; i < maxId; i++) {
          clearInterval(i)
        }
        minId = maxId + 1
      }
    }
    const clearScheduledButton = document.getElementById('clear-scheduled-button')
    document.getElementById('clear-scheduled-input')
      .addEventListener('change', (event) => {
        if (event.target.checked) {
          clearScheduledButton.style = 'display: inline-block;'
        } else {
          clearScheduledButton.style = 'display: none;'
        }
      })
    clearScheduledButton.addEventListener('click', clearAllScheduledFactory())
    // }

    // if (this.config.locals.flowchart) {
    const flowchartButton = document.getElementById('flowchart-button')
    document.getElementById('flowchart-input')
      .addEventListener('change', (event) => {
        if (event.target.checked) {
          flowchartButton.style = 'display: inline-block;'
        } else {
          flowchartButton.style = 'display: none;'
        }
      })
    flowchartButton
      .addEventListener('click', () => this.studyWith('flowchart'))
    // }

    // if (this.config.locals.eval) {

    const evalContainer = document.getElementById('eval-container')
    document.getElementById('eval-input')
      .addEventListener('change', (event) => {
        this.config.locals.eval = !this.config.locals.eval
        if (event.target.checked) {
          evalContainer.style = 'display: inline-block;'
        } else {
          evalContainer.style = 'display: none;'
        }
      })

    document.getElementById('console-button')
      .addEventListener('click', () => this.studyWith('console'))
    document.getElementById('debugger-button')
      .addEventListener('click', () => this.studyWith('debugger'))
    // }

    // if (this.config.locals.openIn) {
    const openInContainer = document.getElementById('open-in-container')
    document.getElementById('open-in-input')
      .addEventListener('change', (event) => {
        this.config.locals.openIn = !this.config.locals.openIn
        if (event.target.checked) {
          openInContainer.style = 'display: inline-block;'
        } else {
          openInContainer.style = 'display: none;'
        }
      })

    document.getElementById('open-in-button')
      .addEventListener('click', (event) => {
        const thisThing = event.target.form.thisThing.value
        this.studyWith(thisThing)
      })
    // }

    if (this.config.locals.traceLog) {
      console.log(3)
      const instrumentButton = document.createElement('button')
      instrumentButton.innerHTML = 'traceLog'
      instrumentButton.addEventListener('click', () => {
        // using XHR to avoid "in promise" error messages
        const xhr = new XMLHttpRequest();
        const paramConfig = {
          content: this.editor.getValue()
        }
        const paramSafeConfig = encodeURIComponent(JSON.stringify(paramConfig))
        xhr.open('GET', window.location.origin + '?trace-log=' + paramSafeConfig);
        xhr.responseType = 'text';
        xhr.send();
        xhr.onload = () => {
          if (xhr.status != 200) {
            console.log('error instrumenting code', xhr)
          } else {
            console.log(xhr.response)
          }
        }
        xhr.onerror = function (err) {
          console.error(err);
        }
      })
      const buttonsPanel = openInContainer.parentElement
      buttonsPanel.appendChild(instrumentButton)
    }

  }

  static insertLoopGuards = (evalCode, maxIterations) => {
    let loopNum = 0
    const loopHeadRegex = /(for|while)([\s]*)\(([^\{]*)\{|do([\s]*)\{/gm;
    return evalCode.replace(loopHeadRegex, loopHead => {
      const id = ++loopNum
      return `let loopGuard_${id} = 0\n${loopHead}\nif (++loopGuard_${id} > ${maxIterations}) { throw new RangeError('loopGuard_${id} is greater than ${maxIterations}') }\n`
    })
  }

  studyWith(environment) {

    if (
      this.config.locals.loopGuard && this.config.locals.loopGuard.active
      && !(environment === 'parsons' || environment === 'flowchart')) {

      const code = this.editor.getValue()

      const loopGuarded = JavaScriptFE.insertLoopGuards(code, this.config.locals.loopGuard.max || 20);

      let formattedCode = ''
      let noSyntaxErrors = false
      try {
        formattedCode = prettier.format(
          loopGuarded,
          {
            parser: "babel",
            plugins: prettierPlugins,
          })
        noSyntaxErrors = true
      } catch (err) {
        eval(code)
      }

      if (noSyntaxErrors) {
        studyWith[environment](formattedCode)
      }

    } else {
      studyWith[environment](this.editor.getValue())
    }

  }


}
