"use strict";

const CodeSSR = require("./code.js");

class JavaScriptSSR extends CodeSSR {
  constructor({ config, resource }) {
    super({ config, resource });
    this.config.locals.run =
      this.config.locals.run || this.config.locals.eval || false;
    this.config.locals.debug =
      this.config.locals.debug || this.config.locals.eval || false;
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
      <script src='${this.config.sharedStatic}/prettier/parser-babel.js'></script>`
    );
  }

  configOptions() {
    const superConfigOptions = super.configOptions();
    return (
      `
    <form>
      <input id='run-input' type='checkbox' ${
        this.config.locals.run || this.config.locals.eval ? "checked" : ""
      } /> <label for='run-input'>run</label>
    </form>

    ${
      this.config.locals.trace
        ? `<form>
      <input id='trace-input' type='checkbox' ${
        this.config.locals.trace ? "checked" : ""
      } /> <label for='trace-input'>trace</label>
    </form>`
        : ""
    }
    <form>
      <input id='debug-input' type='checkbox' ${
        this.config.locals.debug || this.config.locals.eval ? "checked" : ""
      } /> <label for='debug-input'>debug</label>
    </form>
    <form>
      <input id='open-in-input' type='checkbox' ${
        this.config.locals.openIn ? "checked" : ""
      } /> <label for='open-in-input'>open in ...</label>
    </form>
    <form>
      <input id='loop-guard-input' type='checkbox' ${
        this.config.locals.loopGuard ? "checked" : ""
      } /> <label for='loop-guard-input'>loop guard</label>
    </form>
    <form>
      <input id='clear-scheduled-input' type='checkbox' ${
        this.config.locals.clearScheduled ? "checked" : ""
      } /> <label for='clear-scheduled-input'>clear scheduled</label>
    </form>
    <form>
      <input id='flowchart-input' type='checkbox' ${
        this.config.locals.flowchart ? "checked" : ""
      } /> <label for='flowchart-input'>flowchart</label>
    </form>
    ` + superConfigOptions
    );
  }

  panel() {
    let superPanel = super.panel();

    const locals = this.config.locals;

    // if (locals.loopGuard || locals.clearScheduled || locals.flowchart) {
    superPanel += "<br><div>";
    // }

    // if (locals.loopGuard) {

    const loopGuardDisplay = locals.loopGuard ? "inline-block" : "none";
    if (!locals.loopGuard || typeof locals.loopGuard !== "object") {
      locals.loopGuard = {};
    }
    locals.loopGuard = {
      active:
        typeof locals.loopGuard.active === "boolean"
          ? locals.loopGuard.active
          : false,
      max:
        typeof locals.loopGuard.max === "number" ? locals.loopGuard.max : 100,
    };
    superPanel += `
      <form id='loop-guard-form' style='display: ${loopGuardDisplay};'>
        <input name='active' type='checkbox' ${
          locals.loopGuard.active ? "checked" : ""
        } />
        loop guard:
        <input name='max' type='number' value='${
          locals.loopGuard.max
        }' style='width: 3em;' />
      </form>`;
    // }

    // if (locals.clearScheduled) {
    const clearScheduledDisplay = locals.clearScheduled
      ? "inline-block"
      : "none";
    superPanel += `
      <button id='clear-scheduled-button' style='display: ${clearScheduledDisplay};'>clear scheduled</button>`;
    // }

    // if (locals.flowchart) {
    const flowchartDisplay = locals.flowchart ? "inline-block" : "none";
    superPanel += `
      <button id='flowchart-button' style='display: ${flowchartDisplay};'>flowchart</button>`;
    // }

    superPanel += "</div>";

    // if (locals.eval || locals.openIn) {
    superPanel += "<div>";
    // }

    // if (locals.eval) {
    const runDisplay = locals.eval || locals.run ? "inline-block" : "none";
    superPanel += `
    <div id='run-container' style='display: ${runDisplay};'>
      <button id='run-button'>run</button>
    </div>`;

    const traceDisplay = locals.trace ? "inline-block" : "none";

    // TODO: refactor the check-boxes to render from trace's config
    superPanel += `
    <div id='trace-container' style='display: ${traceDisplay};'>
      <button id='trace-button'>trace</button>

      <div class="dropdown">
        <code>options</code>
        <div  class='dropdown-content'>
          <form  id='trace-config'>
            <input id='variables' type='checkbox' checked /> <label for='variables'>variables</label> <br>
            <input id='blocks' type='checkbox' checked /> <label for='blocks'>blocks</label> <br>
            <input id='functions' type='checkbox'  /> <label for='functions'>function calls</label> <br>
            <input id='this' type='checkbox'  /> <label for='this'>this</label>
            <hr>
            <input id='lines' type='checkbox' checked /> <label for='lines'>lines</label> <br>
            <input id='steps' type='checkbox' checked /> <label for='steps'>steps</label> <br>
          </form>
        </div>
      </div>
    </div>`;

    const debugDisplay = locals.eval || locals.debug ? "inline-block" : "none";
    superPanel += `
    <div id='debug-container' style='display: ${debugDisplay};'>
      <button id='debug-button'>debug</button>
    </div>`;
    // }
    // if (locals.openIn) {
    const openInDisplay = locals.openIn ? "inline-block" : "none";
    const openable = [
      "jsTutorLive",
      "jsTutor",
      "promisees",
      "loupe",
      "esprima",
    ];
    superPanel += `<form id='open-in-container' style='display: ${openInDisplay};'>
        <input id='open-in-button' value='open in' type='button'/>
        <select name='thisThing'>
          ${openable.map((viztool) => {
            return `<option ${
              viztool === locals.openIn ? "selected" : ""
            }>${viztool}</option>`;
          })}
        </select>
      </form>`;
    // }

    superPanel += "</div>";

    return superPanel;
  }

  code() {
    const superCode = super.code();
    return superCode;
  }

  scriptsBody() {
    let superScriptsBody = super.scriptsBody();
    superScriptsBody += `
      <script src='${this.config.ownStatic}/types/javascript/static/clear-scheduled.js'></script>
      <script src='${this.config.sharedStatic}/lib/strip-comments.js'></script>`;

    if (this.config.locals.trace) {
      superScriptsBody += `
        <script src='${this.config.ownStatic}/types/javascript/static/trace/aran-build.js'></script>
        <script src='${this.config.ownStatic}/types/javascript/static/trace/index.js' type='module'></script>`;
    }
    const base = this.resource.info.base;
    const isTestedFile =
      Array.isArray(this.config.locals.testExtensions) &&
      this.config.locals.testExtensions.some((extension) =>
        base.includes(`.${extension}.`)
      );
    console.log(this.config.locals.testExtensions);
    console.log("---", isTestedFile);
    if (isTestedFile) {
      superScriptsBody += `<script src='${this.config.ownStatic}/dependencies/describe-it.js'></script>
      <script>
        define('chai',
          ["${this.config.ownStatic}/dependencies/chai-and-chai-dom.js"],
          function (require, exports, beta) {
            return require;
          }
        );
      </script>`;
    }

    return superScriptsBody;
  }
}

module.exports = JavaScriptSSR;
