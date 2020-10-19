import { CodeFE } from '../code/code-class.js'
import { studyWith } from './lib/study-with.js'

export class JavaScriptFE extends CodeFE {

  constructor(config) {
    super(config)
    this.initJsUi()
  }

  static insertLoopGuards(code, maxIterations) {
    let loopNum = 0
    return code.replace(/for *\(.*\{|while *\(.*\{|do *\{/g, loopHead => {
      const id = ++loopNum
      return `let loopGuard_${id} = 0\n${loopHead}\nif (++loopGuard_${id} > ${maxIterations}) { throw new RangeError('loopGuard_${id} is greater than ${maxIterations}') }\n`
    })
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

  }


  studyWith(environment) {

    if (this.config.locals.loopGuard && this.config.locals.loopGuard.active) {
      // using xhr so any errors aren't "in promise"
      const xhr = new XMLHttpRequest();
      const paramConfig = {
        // code: JavaScriptFE.insertLoopGuards(strip(this.editor.getValue()), this.config.locals.loopGuard.max),
        // it's more often helpful to have comments than not
        // and the parsonizer strips it's own comments
        code: JavaScriptFE.insertLoopGuards(this.editor.getValue(), this.config.locals.loopGuard.max),
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
          studyWith[environment](formattedCode)
        }
      }
      xhr.onerror = function (err) {
        console.error(err);
      }
    } else {
      studyWith[environment](this.editor.getValue())
    }

  }


}
