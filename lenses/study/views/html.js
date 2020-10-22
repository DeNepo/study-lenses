'use strict'

const CodeSSr = require('./code.js')

class HtmlSSR extends CodeSSr {

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
    return superPanel + `<br><br>
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

