'use strict'

const CodeSSR = require('./code.js')

class JavaScriptSSR extends CodeSSR {

  constructor({ config, resource }) {
    super({ config, resource })
  }

  styles() {
    const superStyles = super.styles()
    return superStyles
  }

  scriptsHead() {
    const superScriptsHead = super.scriptsHead()
    return superScriptsHead + `
      <script src='${this.config.sharedStatic}/prettier/standalone.js'></script>
      <script src='${this.config.sharedStatic}/prettier/parser-babel.js'></script>`
  }

  configOptions() {
    const superConfigOptions = super.configOptions()
    return superConfigOptions + `
    <form>
      <input id='loop-guard-input' type='checkbox' ${this.config.locals.loopGuard ? 'checked' : ''} /> loop guards
    </form>
    <form>
      <input id='clear-scheduled-input' type='checkbox' ${this.config.locals.clearScheduled ? 'checked' : ''} /> clear scheduled
    </form>
    <form>
      <input id='flowchart-input' type='checkbox' ${this.config.locals.flowchart ? 'checked' : ''} /> flowchart
    </form>
    <form>
      <input id='eval-input' type='checkbox' ${this.config.locals.eval ? 'checked' : ''} /> eval
    </form>
    <form>
      <input id='open-in-input' type='checkbox' ${this.config.locals.openIn ? 'checked' : ''} /> open in ...
    </form>`
  }

  panel() {
    let superPanel = super.panel()

    const locals = this.config.locals

    // if (locals.loopGuard || locals.clearScheduled || locals.flowchart) {
    superPanel += '<br><div>'
    // }

    // if (locals.loopGuard) {

    const loopGuardDisplay = locals.loopGuard ? 'inline-block' : 'none'
    if (!locals.loopGuard || typeof locals.loopGuard !== 'object') {
      locals.loopGuard = {}
    }
    locals.loopGuard = {
      active: typeof locals.loopGuard.active === 'boolean' ? locals.loopGuard.active : true,
      max: typeof locals.loopGuard.max === 'number' ? locals.loopGuard.max : 100,
    }
    superPanel += `
      <form id='loop-guard-form' style='display: ${loopGuardDisplay};'>
        <input name='active' type='checkbox' ${locals.loopGuard.active ? 'checked' : ''} />
        loop guards:
        <input name='max' type='number' value='${locals.loopGuard.max}' style='width: 3em;' />
      </form>`
    // }

    // if (locals.clearScheduled) {
    const clearScheduledDisplay = locals.clearScheduledDisplay ? 'inline-block' : 'none'
    superPanel += `
      <button id='clear-scheduled-button' style='display: ${clearScheduledDisplay};'>clear scheduled</button>`
    // }

    // if (locals.flowchart) {
    const flowchartDisplay = locals.flowchart ? 'inline-block' : 'none'
    superPanel += `
      <button id='flowchart-button' style='display: ${flowchartDisplay};'>flowchart</button>`
    // }

    superPanel += '</div>'

    // if (locals.eval || locals.openIn) {
    superPanel += '<div>'
    // }

    // if (locals.eval) {
    const evalDisplay = locals.eval ? 'inline-block' : 'none'
    superPanel += `
    <div id='eval-container' style='display: ${evalDisplay};'>
      <button id='console-button'>console</button>
      <button id='debugger-button'>debugger</button>
    </div>`
    // }
    // if (locals.openIn) {
    const openInDisplay = locals.openIn ? 'inline-block' : 'none'
    const openable = ['jsTutor', 'promisees', 'loupe', 'esprima']
    superPanel += `<form id='open-in-container' style='display: ${openInDisplay};'>
        <input id='open-in-button' value='open in' type='button'/>
        <select name='thisThing'>
          ${openable.map(viztool => {
      return `<option ${viztool === locals.openIn ? 'selected' : ''}>${viztool}</option>`
    })}
        </select>
      </form>`
    // }

    superPanel += '</div>'

    return superPanel
  }

  code() {
    const superCode = super.code()
    return superCode
  }

  scriptsBody() {
    const superScriptsBody = super.scriptsBody()
    return `${superScriptsBody}
    <script src='${this.config.sharedStatic}/lib/strip-comments.js'></script>`
  }

}

module.exports = JavaScriptSSR

