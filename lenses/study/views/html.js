"use strict";

const CodeSSr = require("./code.js");

class HtmlSSR extends CodeSSr {
  constructor({ config, resource }) {
    super({ config, resource });
    this.config.loopGuard = {
      active: false,
      max: 20,
    };
  }

  styles() {
    const superStyles = super.styles();
    return superStyles;
  }

  scriptsHead() {
    const superScriptsHead = super.scriptsHead();
    return (
      superScriptsHead +
      `
      <script src='${this.config.sharedStatic}/prettier/standalone.js'></script>
      <script src='${this.config.sharedStatic}/prettier/parser-html.js'></script>
      <script src='${this.config.sharedStatic}/prettier/parser-babel.js'></script>
      <script src='${this.config.sharedStatic}/prettier/parser-postcss.js'></script>`
    );
  }

  panel() {
    const superPanel = super.panel();

    return (
      superPanel +
      `<br><br>
    <div style='display: flex; flex-direction: row;'>
      <input id='editor-checkbox' name='editor-checkbox' type='checkbox' checked /> <label for='editor-checkbox' style='margin-right: 0.5em;'>editor</label>
      | <div id='render-config' style='display: inline-block; display: flex; flex-direction: row; margin-right: 0.5em;'>
        <button id='render-button' style='margin-left: 0.5em;'>re-render</button>
        <input id='live' name='live' type='checkbox' /> <label for='live'>live reload</label>
      </div>
      | <button id='new-tab-button' style='margin-left: 0.5em;'>open in new tab</button>
    </div>`
    );
  }

  code() {
    const superCode = super.code();
    return `<div id='resize-parent' style="display: flex; flex-direction: row;">
      <div id='editor-container' style='height: 95vh; width: 60vw'></div>
      <div id='output-container' style='height: 95vh; width: 40vw'> </div>
    </div>`;
  }

  scriptsBody() {
    const superScriptsBody = super.scriptsBody();
    return `${superScriptsBody}
    <script src='${this.config.sharedStatic}/lib/debounce.js'></script>`;
  }
}

module.exports = HtmlSSR;
