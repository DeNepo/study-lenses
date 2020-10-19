'use strict'

const CodeSSR = require('./code.js')

class JavaScriptSSR extends CodeSSR {

  constructor({ config, resource }) {
    super({ config, resource })
  }

  styles() {
    const superStyles = super.styles()
    return superStyles + `
    <style> main { display: flex; flex-direction: row; } </style>`
  }

  scriptsHead() {
    const superScriptsHead = super.scriptsHead()
    return superScriptsHead + `
    <script src="${this.config.sharedStatic}/p5.min.js"></script>
    <script> function setup() { } </script>`
  }

  panel() {
    let superPanel = super.panel()
    return superPanel + `<br><br>
    <button id='refresh-button'>refresh</button>
    <input id='loop-checkbox' type='checkbox' checked /> loop
    <input id='live-refresh-checkbox' type='checkbox' /> live refresh`
  }

  code() {
    const superCode = super.code()
    return `<div id='editor-container' style='height: 95vh; width: 50vw'></div>`
  }

  scriptsBody() {
    const superScriptsBody = super.scriptsBody()
    return `${superScriptsBody}
    <script src='${this.config.sharedStatic}/lib/debounce.js'></script>`
  }

}

module.exports = JavaScriptSSR

