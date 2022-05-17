'use strict';

class CodeSSR {
  constructor({ config, resource }) {
    this.config = config;
    this.resource = resource;
    this.config.locals.diff = this.config.locals.diff || false;
  }

  styles() {
    return `<link rel="stylesheet" data-name="vs/editor/editor.main" href="${this.config.sharedStatic}/monaco/min/vs/editor/editor.main.css">
      <link rel='stylesheet' href='${this.config.ownStatic}/style.css' >`;
  }

  scriptsHead() {
    return '';
  }

  configOptions() {
    return `
      <form>
        <input id='diff-input' type='checkbox' ${
          this.config.locals.diff ? 'checked' : ''
        } /> <label for='diff-input'>diff</label>
      </form>`;
  }

  panel() {
    return `<!-- <input id='read-only-input' type='checkbox' checked='true' /> read-only -->
    ${
      this.config.locals.save === true
        ? `<button id='save-button' style="font-weight: bold; background-color: black; color: white;">SAVE CHANGES</button>`
        : ''
    }
    <form style='display: inline-block'>
      <input id='dark-checkbox' type='checkbox' checked /> <label for='dark-checkbox'>dark</label>
    </form>
    <form style='display: inline-block'>
      <input id='minimap-checkbox' type='checkbox' /> <label for='minimap-checkbox'>minimap</label>
    </form>
    ||
    <button id='reset-button'>reset</button>
    <button id='format-button'>format</button>
    <button id='permalink-button'>permalink</button>
    <button id='print-selection-button'>print selection</button>

    <br><br>
    <button id='highlight-selection-button'>highlight</button>
    <button id='parsonize-selection-button' style='display: ${
      this.config.locals.parsons === false ? 'none' : 'inline-block'
    };'>parsonize</button>
    <button id='diff-selection-button' style='display: ${
      this.config.locals.diff ? 'inline-block' : 'none'
    };'>diff</button>
    <!-- <div id='buttons-panel'></div> -->`;
  }

  code() {
    return `<div id='editor-container' style='height: 95vh'></div>`;
  }

  configScript() {
    return `<script>
    var config = JSON.parse(decodeURIComponent("${encodeURIComponent(
      JSON.stringify(this.config),
    )}"))
  </script>`;
  }

  scriptsBody() {
    return `<script>var require = { paths: { 'vs': '${this.config.sharedStatic}/monaco/min/vs' } };</script>
  <script src="${this.config.sharedStatic}/monaco/min/vs/loader.js"></script>
  <script src="${this.config.sharedStatic}/monaco/min/vs/editor/editor.main.nls.js"></script>
  <script src="${this.config.sharedStatic}/monaco/min/vs/editor/editor.main.js"></script>

  <script src='${this.config.sharedStatic}/lib/monaco-ext-to-language.js'></script>

  <script src="${this.config.ownStatic}/lib/get-monaco-selection.js"></script>
  <script src="${this.config.ownStatic}/lib/study-selection.js"></script>`;

    // <script src='${this.config.ownStatic}/lib/monacoing.js'></script>
    // <script src='${this.config.ownStatic}/lib/get-monaco-selection.js'></script>
    // <script src='${this.config.ownStatic}/lib/study-selection.js'></script>`
  }
}

module.exports = CodeSSR;
