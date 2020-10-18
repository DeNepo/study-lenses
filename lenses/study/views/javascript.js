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
    return superScriptsHead
  }

  panel() {
    let superPanel = super.panel()

    const locals = this.config.locals

    if (locals.loopGuard || locals.clearScheduled || locals.flowchart) {
      superPanel += '<br><br>'
    }
    if (locals.loopGuard) {

      if (locals.loopGuard && typeof locals.loopGuard !== 'object') {
        locals.loopGuard = {
          active: true,
          max: 20
        }
      }
      superPanel += `
      <form id='loop-guard-form' style='display: inline;'>
        <input name='active' type='checkbox' ${locals.loopGuard.active ? 'checked' : ''} />
        loop guard:
        <input name='max' type='number' value='${locals.loopGuard.max}' style='width: 3em;' />
      </form>`
    }
    if (locals.clearScheduled) {
      superPanel += `
      <button id='clear-scheduled-button'>clear scheduled</button>`
    }
    if (locals.flowchart) {
      superPanel += `
      || <button id='flowchart-button'>flowchart</button>`
    }
    if (locals.eval || locals.openIn) {
      superPanel += '<br><br>'
    }
    if (locals.eval) {
      superPanel += `
      <button id='console-button'>console</button>
      <button id='debugger-button'>debugger</button>`
    }
    if (locals.openIn) {
      const openable = ['jsTutor', 'loupe', 'promisees', 'esprima']
      superPanel += ` ||
      <form style='display: inline;'>
        <input id='open-in-button' value='open in' type='button'/>
        <select name='thisThing'>
          ${openable.map(viztool => {
        return `<option ${viztool === locals.openIn ? 'selected' : ''}>${viztool}</option>`
      })}
        </select>
      </form>`
    }
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

