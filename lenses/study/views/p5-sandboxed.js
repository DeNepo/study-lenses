// in progress: run it in an iframe

"use strict";

const CodeSSR = require("./code.js");

class P5SSR extends CodeSSR {
  constructor({ config, resource }) {
    super({ config, resource });
  }

  styles() {
    const superStyles = super.styles();
    return (
      superStyles +
      `
    <style> main { display: flex; flex-direction: row; } </style>`
    );
  }

  configOptions() {
    return "";
  }

  scriptsHead() {
    const superScriptsHead = super.scriptsHead();
    return (
      superScriptsHead +
      `
    <script src='${this.config.sharedStatic}/wc-trace-table/configurable-button.js' type='module'></script>
    <script src='${this.config.sharedStatic}/ask/component/ask-me.js' type='module'></script>
    <script src='${this.config.sharedStatic}/parsonizer/jquery.min.js'></script>
    <script src='${this.config.sharedStatic}/parsonizer/jquery-ui.min.js'></script>
    <script src='${this.config.sharedStatic}/trace/aran-build.js'></script>
    <script src='${this.config.sharedStatic}/prettier/standalone.js'></script>
    <script src='${this.config.sharedStatic}/prettier/parser-babel.js'></script>

    <!-- <script src="${this.config.sharedStatic}/p5.min.js"></script> -->

    <script> function setup() { } </script>`
      // <script src='${this.config.sharedStatic}/trace/aran-build.js'></script>
      // <script src='${this.config.sharedStatic}/trace/index.js' type='module'></script>
      // <script src='${this.config.sharedStatic}/trace/trace-init.js' type='module'></script>
    );
  }

  panel() {
    let superPanel = super.panel();
    return (
      superPanel +
      `
      <button id='variables-button'>variables</button>
      <button id='flowchart-button'>flowchart</button>
      <button id='blanks-button'>blanks</button>
      <trace-table-button></trace-table-button>
      <ask-me style='display: inline-block'></ask-me>
      <br><br>
      <div style='display: flex; flex-direction: row;'>
        <div style='display: flex; flex-direction: row;'>
          <input id='editor-checkbox' name='editor-checkbox' type='checkbox' checked /> <label for='editor-checkbox' style='margin-right: 0.5em;'>editor</label>
          | <div id='render-config' style='display: inline-block; display: flex; flex-direction: row; margin-right: 0.5em;'>
            <button id='render-button' style='margin-left: 0.5em;'>re-render</button>
            <input id='live' name='live' type='checkbox' /> <label for='live'>live reload</label>
          </div>
          |
          <form id='controls' style='margin-left: 0.5em;'>
            <button id='restart-button'>restart</button>
            | <input id='loop' name='how' value='loop' type='radio' checked /> <label for='loop'>play</label>
            <input id='pause' name='how' value='pause' type='radio' /> <label for='pause'>pause</label>
            | <input id='step' name='how' value='step' type='radio' /> <label for='step'>step</label>
            <input id='delay-input' style='width: 7em;' type='range' />
            | <input id='slow' name='how' value='slow' type='radio' /> <label for='slow'>frame rate</label>
            <input id='slow-input' style='width: 7em;' type='range' />
          </form>
        </div>
      </div>`
      // <input id='trace-checkbox' type='checkbox' /> trace`
    );
  }

  code() {
    const superCode = super.code();
    return `
      <div id='editor-container' style='height: 95vh; width: 100vw; '></div>
      <div id='p5-container'></div>`;
  }

  scriptsBody() {
    const superScriptsBody = super.scriptsBody();
    return `${superScriptsBody}
    <script src='${this.config.sharedStatic}/lib/debounce.js'></script>`;
  }
}

module.exports = P5SSR;
