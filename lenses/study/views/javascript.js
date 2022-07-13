const fs = require('fs');
const path = require('path');

const CodeSSR = require('./code.js');

const hasSpec = (info) => {
  if (!info.root || !info.dir || !info.base) {
    return false;
  }
  const absolutePath = path.join(info.root, info.dir, info.base);
  const absoluteSpecPath = absolutePath.split('.js').join('.spec.js');
  return fs.existsSync(absoluteSpecPath);
};

const hasRe = (info) => {
  if (!info.root || !info.dir || !info.base) {
    return false;
  }
  const absolutePath = path.join(info.root, info.dir, info.base);
  const absoluteSpecPath = absolutePath.split('.js').join('.re.js');
  return fs.existsSync(absoluteSpecPath);
};

class JavaScriptSSR extends CodeSSR {
  constructor({ config, resource }) {
    super({ config, resource });
    this.config.locals.run =
      this.config.locals.run || this.config.locals.eval || false;
    this.config.locals.debug =
      this.config.locals.debug || this.config.locals.eval || false;

    this.config.trace = config.trace;

    this.config.hasSpec = !this.config.stepsExt && hasSpec(resource.info);

    this.config.hasRe = hasRe(resource.info);
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
      <script type="module">
        import { walk } from '${this.config.sharedStatic}/estree-walker/index.js'
        window.walk = walk;
      </script>
      <script src='${this.config.sharedStatic}/prettier/standalone.js'></script>
      <script src='${this.config.sharedStatic}/prettier/parser-babel.js'></script>
      <script src='${this.config.sharedStatic}/ask/component/ask-me.js' type='module'></script>
      <script src='${this.config.sharedStatic}/trace/aran-build.js'></script>
      <script src='${this.config.sharedStatic}/trace/index.js' type='module'></script>
      <script src='${this.config.sharedStatic}/trace/trace-init.js' type='module'></script>
      <script src='${this.config.sharedStatic}/parsonizer/jquery.min.js'></script>
      <script src='${this.config.sharedStatic}/parsonizer/jquery-ui.min.js'></script>
      <script src='${this.config.sharedStatic}/wc-trace-table/configurable-button.js' type='module'></script>
      <script src='${this.config.sharedStatic}/shift/parser.js'></script>
      <script src='${this.config.sharedStatic}/astravel.min.js'></script>
      <script src='${this.config.sharedStatic}/web-components/ast-it/index.js' type='module'></script>
      <!-- <script src='${this.config.sharedStatic}/trace/shadow-state.js'></script> -->`
    );
  }

  configOptions() {
    const superConfigOptions = super.configOptions();
    return `

    -- static --
    <form>
      <input id='variables-input' type='checkbox' ${
        this.config.locals.variables ? 'checked' : ''
      } /> <label for='variables-input'>variables</label>
    </form>
    <form>
      <input id='flowchart-input' type='checkbox' ${
        this.config.locals.flowchart ? 'checked' : ''
      } /> <label for='flowchart-input'>flowchart</label>
    </form>
    <form>
      <input id='blanks-input' type='checkbox' ${
        this.config.locals.blanks ? 'checked' : ''
      } /> <label for='blanks-input'>blanks</label>
    </form>
    <form>
      <input id='writeme-input' type='checkbox' ${
        this.config.locals.writeme ? 'checked' : ''
      } /> <label for='writeme-input'>writeme</label>
    </form>
    <form>
      <input id='ask-input' type='checkbox' ${
        this.config.locals.ask ? 'checked' : ''
      } /> <label for='ask-input'>ask me</label>
    </form>
    <form>
      <input id='pseudo-input' type='checkbox' ${
        this.config.locals.pseudo ? 'checked' : ''
      } /> <label for='pseudo-input'>pseudo code</label>
    </form>
    ${superConfigOptions}
    <form>
      <input id='deps-input' type='checkbox' ${
        this.config.locals.deps ? 'checked' : ''
      } /> <label for='deps-input'>dependencies</label>
    </form>
    <form>
      <input id='eslint-input' type='checkbox' ${
        this.config.locals.eslint ? 'checked' : ''
      } /> <label for='eslint-input'>eslint</label>
    </form>
    <form>
      <input id='ast-input' type='checkbox' ${
        this.config.locals.ast ? 'checked' : ''
      } /> <label for='ast-input'>syntax tree</label>
    </form>
    <br>
    -- dynamic --
    <form>
      <input id='run-input' type='checkbox' ${
        this.config.locals.run || this.config.locals.eval ? 'checked' : ''
      } /> <label for='run-input'>run</label>
    </form>
    <form>
      <input id='debug-input' type='checkbox' ${
        this.config.locals.debug || this.config.locals.eval ? 'checked' : ''
      } /> <label for='debug-input'>debug</label>
    </form>
    <form>
      <input id='table-input' type='checkbox' ${
        this.config.locals.table ? 'checked' : ''
      } /> <label for='table-input'>trace table</label>
    </form>
    <form>
      <input id='trace-input' type='checkbox' ${
        this.config.locals.trace ? 'checked' : ''
      } /> <label for='trace-input'>trace button</label>
    </form>
    <form>
      <input id='open-in-input' type='checkbox' ${
        this.config.locals.openIn ? 'checked' : ''
      } /> <label for='open-in-input'>open in ...</label>
    </form>
    <form>
      <input id='p5-input' type='checkbox' ${
        this.config.locals.p5 ? 'checked' : ''
      } /> <label for='p5-input'>p5</label>
    </form>
    <br>
    -- helpful things --
    <form>
      <input id='loop-guard-input' type='checkbox' ${
        this.config.locals.loopGuard ? 'checked' : ''
      } /> <label for='loop-guard-input'>loop guard</label>
    </form>
    <form>
      <input id='environment-input' type='checkbox' ${
        this.config.locals.environment ? 'checked' : ''
      } /> <label for='environment-input'>environment</label>
    </form>
    <form>
      <input id='tests-input' type='checkbox' ${
        this.config.locals.tests ? 'checked' : ''
      } /> <label for='tests-input'>tests</label>
    </form>
    <form>
      <input id='clear-scheduled-input' type='checkbox' ${
        this.config.locals.clearScheduled ? 'checked' : ''
      } /> <label for='clear-scheduled-input'>clear scheduled</label>
    </form>
    <br>
    -- save configs --
    <button id='download-config'>download</button>
    <button id='copy-config'>copy</button>
    `;
  }

  panel() {
    let superPanel = super.panel();

    const locals = this.config.locals;

    // if (locals.loopGuard || locals.clearScheduled || locals.flowchart) {

    // if (locals.flowchart) {
    const flowchartDisplay = locals.flowchart ? 'inline-block' : 'none';
    superPanel += `
      <button id='flowchart-button' style='display: ${flowchartDisplay};'>flowchart</button>`;
    // }

    const pseudoDisplay = locals.pseudo ? 'inline-block' : 'none';
    superPanel += `
      <button id='pseudo-button' style='display: ${pseudoDisplay};'>pseudo</button>`;

    const variablesDisplay = locals.variables ? 'inline-block' : 'none';
    superPanel += `
      <button id='variables-button' style='display: ${variablesDisplay};'>variables</button>`;

    const blanksDisplay = locals.blanks ? 'inline-block' : 'none';
    superPanel += `
      <button id='blanks-button'  style='display: ${blanksDisplay};'>blanks</button>`;

    const writemeDisplay = locals.writeme ? 'inline-block' : 'none';
    superPanel += `
      <button id='writeme-button'  style='display: ${writemeDisplay};'>writeme</button>`;

    const astDisplay = locals.ast ? 'inline-block' : 'none';
    superPanel += `<div id='ast-container' style='display: ${astDisplay};'>
      <ast-it></ast-it>
    </div>`;

    superPanel += `
    <br>  <div>
    <form id='environment-form' style='display: ${
      locals.environment ? 'inline-block' : 'none'
    };'>
      <!-- <input name='strict' id='strict' type='checkbox' ${
        locals.strict === true || locals.type === 'module' ? 'checked' : ''
      } />
      <label for='strict'>strict</label> -->
      <input name='module' id='module' type='checkbox' ${
        locals.type === 'module' ? 'checked' : ''
      } />
      <label for='module'>module</label>
    </form>`;
    // }

    // if (locals.loopGuard) {

    const loopGuardDisplay = locals.loopGuard ? 'inline-block' : 'none';
    if (!locals.loopGuard || typeof locals.loopGuard !== 'object') {
      locals.loopGuard = {};
    }
    locals.loopGuard = {
      active:
        typeof locals.loopGuard.active === 'boolean'
          ? locals.loopGuard.active
          : false,
      max:
        typeof locals.loopGuard.max === 'number' ? locals.loopGuard.max : 100,
    };
    superPanel += `
      <form id='loop-guard-form' style='display: ${loopGuardDisplay};'>
        <input name='active' id='loop-guard-active' type='checkbox' ${
          locals.loopGuard.active ? 'checked' : ''
        } />
        <label for='loop-guard-active'>loop guard:</label>
        <input name='max' type='number' value='${
          locals.loopGuard.max
        }' style='width: 3em;' />
      </form>`;
    // }

    const showTests =
      this.config.hasSpec ||
      locals.tests ||
      Array.isArray(this.config.locals.tests)
        ? this.config.locals.tests.some((ext) =>
            this.resource?.path?.includes(ext),
          )
        : false;

    const testsDisplay = showTests ? 'inline-block' : 'none';
    superPanel += `
      <form id='tests-form' style='display: ${testsDisplay};'>
        <input name='tests' id='tests' type='checkbox' ${
          locals.loopGuard.tests ? 'checked' : ''
        } />
        <label for='tests'>tests</label>
      </form>`;

    const clearScheduledDisplay = locals.clearScheduled
      ? 'inline-block'
      : 'none';
    superPanel += `
      <button id='clear-scheduled-button' style='display: ${clearScheduledDisplay};'>clear scheduled</button>`;

    const eslintDisplay = locals.eslint ? 'inline-block' : 'none';
    superPanel += `
    <div id='eslint-container' style='display: ${eslintDisplay};'>
      <button id='eslint-button'>eslint</button>
    </div>`;

    const depsDisplay = locals.deps ? 'inline-block' : 'none';
    superPanel += `
    <div id='deps-container' style='display: ${depsDisplay};'>
      <button id='deps-button'>dependencies</button>
    </div>`;

    const tableDisplay = locals.table ? 'inline-block' : 'none';
    superPanel += `
    <div id='table-container' style='display: ${tableDisplay};'>
      <trace-table-button></trace-table-button>
    </div>`;

    superPanel += '</div>';

    superPanel += '<div>';

    const reDisplay =
      this.config.hasRe && (locals.eval || locals.debug || locals.run)
        ? 'inline-block'
        : 'none';
    superPanel += `
    <div id='re-container' style='display: ${reDisplay};'>
      <button id='re-button'>solution</button> ||
    </div>`;

    const runDisplay = locals.eval || locals.run ? 'inline-block' : 'none';
    superPanel += `
    <div id='run-container' style='display: ${runDisplay};'>
      <button id='run-button'>run</button>
    </div>`;

    const debugDisplay = locals.eval || locals.debug ? 'inline-block' : 'none';
    superPanel += `
    <div id='debug-container' style='display: ${debugDisplay};'>
      <button id='debug-button'>debug</button>
    </div>`;

    const traceDisplay = locals.trace ? 'inline-block' : 'none';
    superPanel += `
    <div id='trace-container' style='display: ${traceDisplay};'>
      <trace-it event></trace-it>
    </div>`;

    const openInDisplay = locals.openIn ? 'inline-block' : 'none';
    const openable = [
      //  deprecated
      // 'jsTutorLive',
      'jsTutor',
      'jsviz2',
      'learnWithTrace',
      'algoviz',
      'jsv9000',
      'promisees',
      // "esprima",
    ];
    superPanel += `<form id='open-in-container' style='display: ${openInDisplay};'>
        <input id='open-in-button' value='open in' type='button'/>
        <select name='thisThing'>
          ${openable.map((viztool) => {
            return `<option ${
              viztool === locals.openIn ? 'selected' : ''
            }>${viztool}</option>`;
          })}
        </select>
      </form>`;
    // }

    const p5Display = locals.p5 ? 'inline-block' : 'none';
    superPanel += `
    <div id='p5-container' style='display: ${p5Display};'>
      <button id='p5-button'>p5</button>
    </div>`;

    const askDisplay = locals.ask ? 'inline-block' : 'none';
    superPanel += `
    <div id='ask-container' style='display: ${askDisplay};'>
      <ask-me></ask-me>
    </div>`;

    superPanel += '</div>';

    if (locals.steamroll) {
      superPanel += `<button id='steam-it'>steam</button><button id='roll-it'>roll</button>`;
      //   superPanel += `  <form>
      //   <input id='steamroll-it' type='button' value='steamroll' />
      //   <input id='comment' type='checkbox' /> <label for='comment'>comment</label>
      // </form>`;
    }

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
      <script src='${this.config.sharedStatic}/lz-string.min.js'></script>
      <script src='${this.config.sharedStatic}/lib/strip-comments.js'></script>`;

    // const base = this.resource.info.base;
    // const isTestedFile =
    //   Array.isArray(this.config.locals.tests) &&
    //   this.config.locals.tests.some((extension) =>
    //     base.includes(`.${extension}.`)
    //   );
    // if (isTestedFile) {
    superScriptsBody += `
      <script src='${this.config.sharedStatic}/testing/describe-it.js'> </script>
      <script src='${this.config.ownStatic}/dependencies/chai.js'> </script>
      <script src='${this.config.sharedStatic}/testing/jest-matchers.js'> </script>`;
    // }

    return superScriptsBody;
  }
}

module.exports = JavaScriptSSR;

// <script>
//   define('chai',
//     ["${this.config.ownStatic}/dependencies/chai.js"],
//     function (require, exports, beta) {
//       return require;
//     }
//   );
// </script>
// <script src="${this.config.ownStatic}/dependencies/chai-dom.js"></script>;
