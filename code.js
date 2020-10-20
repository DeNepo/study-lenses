'use strict'


class CodeSSR {

  constructor({ config, resource }) {
    this.config = config
    this.resource = resource
  }

  styles() {
    return `<link rel="stylesheet" data-name="vs/editor/editor.main" href="${this.config.sharedStatic}/monaco/min/vs/editor/editor.main.css">
      <link rel='stylesheet' href='${this.config.ownStatic}/style.css' >`
  }

  scriptsHead() {
    return ''
  }

  configOptions() {
    return `<form>
      <input id='lens-selection-input' type='checkbox' /> scramble selection
    </form>`
  }

  panel() {
    return `<!-- <input id='read-only-input' type='checkbox' checked='true' /> read-only -->
    <button id='reset-button'>reset</button>
    <button id='format-button'>format</button>
    <button id='save-button'>save changes</button>
    ||
    <button id='parsonize-selection-button'>parsonize selection</button>
    <button id='lens-selection-button' style='display: none;'>scramble selection</button><div id='buttons-panel'></div>`
  }

  code() {
    return `<div id='editor-container' style='height: 90vh'></div>`
  }

  configScript() {
    return `<script>
    const config = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(this.config))}"))
  </script>`
  }

  scriptsBody() {
    return `<script>var require = { paths: { 'vs': '${this.config.sharedStatic}/monaco/min/vs' } };</script>
  <script src="${this.config.sharedStatic}/monaco/min/vs/loader.js"></script>
  <script src="${this.config.sharedStatic}/monaco/min/vs/editor/editor.main.nls.js"></script>
  <script src="${this.config.sharedStatic}/monaco/min/vs/editor/editor.main.js"></script>

  <script src='${this.config.sharedStatic}/lib/monaco-ext-to-language.js'></script>`

    // <script src='${this.config.ownStatic}/lib/monacoing.js'></script>
    // <script src='${this.config.ownStatic}/lib/get-monaco-selection.js'></script>
    // <script src='${this.config.ownStatic}/lib/study-selection.js'></script>`
  }

}

module.exports = CodeSSR
