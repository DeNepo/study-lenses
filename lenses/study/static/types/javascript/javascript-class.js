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
      return `let loopGuard_${id} = 0\n${loopHead}\nif (++loopGuard_${id} > ${maxIterations}) { throw new Error('Loop ${id} exceeded ${maxIterations} iterations') }\n`
    })
  }

  initJsUi() {
    if (this.config.locals.loopGuard) {
      document.getElementById('loop-guard-form')
        .addEventListener('change', (event) => {
          this.config.locals.loopGuard.active = event.target.form.active.checked
          this.config.locals.loopGuard.max = Number(event.target.form.max.value)
        })
    }
    if (this.config.locals.clearScheduled) {
      const clearAllScheduledFactory = () => {
        // timeout & interval share a pool of ids
        // clearTimeout will also clear intervals, and vice-versa
        // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout#Return_value

        let minId = setTimeout(() => { }, 0);

        return () => {
          const maxId = setTimeout(() => { }, 0);
          for (let i = minId; i < maxId; i++) {
            clearInterval(i);
          };
          minId = maxId + 1;
        };

      }
      document.getElementById('clear-scheduled-button')
        .addEventListener('click', clearAllScheduledFactory())
    }
    if (this.config.locals.flowchart) {
      document.getElementById('flowchart-button')
        .addEventListener('click', () => this.studyWith('flowchart'))
    }
    if (this.config.locals.eval) {
      document.getElementById('console-button')
        .addEventListener('click', () => this.studyWith('console'))
      document.getElementById('debugger-button')
        .addEventListener('click', () => this.studyWith('debugger'))
    }
    if (this.config.locals.openIn) {
      document.getElementById('open-in-button')
        .addEventListener('click', (event) => {
          const thisThing = event.target.form.thisThing.value
          this.studyWith(thisThing)
        })
    }

  }


  studyWith(environment) {

    if (this.config.locals.loopGuard && this.config.locals.loopGuard.active) {
      // using xhr so any errors aren't "in promise"
      const xhr = new XMLHttpRequest();
      const paramConfig = {
        code: JavaScriptFE.insertLoopGuards(strip(this.editor.getValue()), this.config.locals.loopGuard.max),
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
