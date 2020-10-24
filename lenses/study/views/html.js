'use strict'

const CodeSSr = require('./code.js')

class HtmlSSR extends CodeSSr {

  constructor({ config, resource }) {
    super({ config, resource })
    this.config.loopGuard = {
      active: true,
      max: 20
    }
  }

  styles() {
    const superStyles = super.styles()
    return superStyles
  }

  scriptsHead() {
    const superScriptsHead = super.scriptsHead()
    return superScriptsHead + `
      <script src='${this.config.sharedStatic}/prettier/standalone.js'></script>
      <script src='${this.config.sharedStatic}/prettier/parser-html.js'></script>
      <script src='${this.config.sharedStatic}/prettier/parser-babel.js'></script>
      <script src='${this.config.sharedStatic}/prettier/parser-postcss.js'></script>`
  }

  panel() {
    const superPanel = super.panel()

    return superPanel + `<br><br>
    <form id='loop-guard-form' style='display: inline;'>
      <input name='active' type='checkbox' ${this.config.loopGuard.active ? 'checked' : ''} />
      loop guards:
      <input name='max' type='number' value='${this.config.loopGuard.max}' style='width: 3em;' />
    </form>
    <button id='new-tab-button'>open in new tab</button>`
  }

  code() {
    const superCode = super.code()
    return `<div id='resize-parent' style="display: flex; flex-direction: row;">
      <div id='editor-container' style='height: 90vh; width: 50vw'></div>
      <div id='output-container' style='height: 90vh; width: 50vw'> </div>
    </div>`
  }

  scriptsBody() {
    const superScriptsBody = super.scriptsBody()
    return `${superScriptsBody}
    <script src='${this.config.sharedStatic}/lib/debounce.js'></script>`
  }

}

module.exports = HtmlSSR

