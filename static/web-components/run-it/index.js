import { CodeConsumer } from '../base/class-code-consumer.js';

/* implicit global dependencies

  prettier + babel parser
  walk
  acorn, astring (via aran-build for now)
  astravel


*/

export class RunIt extends CodeConsumer {
  config = {
    loopGuard: {
      active: false,
      max: 20,
    },
    type: 'script',
    debug: false,
    container: null,
    globals: {},
    text: 'run',
  };

  constructor(config) {
    super();

    Object.assign(this.config, config);

    this.config.debug = this.hasAttribute('debug');
    this.config.type = this.hasAttribute('module') ? 'module' : 'script';
    this.config.loopGuard.active = this.hasAttribute('loop-guard');
    const maxAttributeValue = this.getAttribute('loop-guard');
    if (
      maxAttributeValue !== '' &&
      maxAttributeValue !== null &&
      !isNaN(maxAttributeValue)
    ) {
      this.config.loopGuard.max = Number(maxAttributeValue);
    }

    if (this.hasAttribute('text') && this.getAttribute('text')) {
      this.config.text = this.getAttribute('text');
    }
  }

  format(code) {
    // does not need to handle creation errors because is only used in loopGuard
    //  loopGuard already handles errors
    try {
      return prettier.format(code, {
        parser: 'babel',
        plugins: prettierPlugins,
      });
    } catch (err) {
      console.error(err);
      return code;
    }
  }

  loopGuard(code) {
    const comments = [];

    let ast;
    try {
      ast = Acorn.parse(code, {
        locations: true,
        sourceType: this.config.type,
        onComment: comments,
      });
    } catch (err) {
      // if there's a creation error, pass it on to runIt for throwing
      return code;
    }

    astravel.attachComments(ast, comments);

    const generateLoopGuard = (id, max) => {
      const variable = Acorn.parse(`let loopGuard_${id} = 0;`).body[0];
      variable.generated = true;
      const check = Acorn.parse(
        `++loopGuard_${id}; if (loopGuard_${id} > ${max}) { throw new RangeError("loopGuard_${id} is greater than ${max}"); }`,
      );
      check.generated = true;
      return {
        variable,
        check,
      };
    };

    let hasLoops = false;

    let loopNumber = 1;

    const runItInstance = this;

    const blockify = (...body) => {
      const blockStatement = Acorn.parse('{}').body[0];
      blockStatement.body = body;
      return blockStatement;
    };
    const guardedTree = walk(ast, {
      enter(node) {
        if (node.generated || node.visited) {
          this.skip();
        }
      },
      leave(node, parent, prop, index) {
        if (
          node.type !== 'WhileStatement' &&
          node.type !== 'ForStatement' &&
          node.type !== 'ForOfStatement' &&
          node.type !== 'ForInStatement' &&
          node.type !== 'DoWhileStatement'
        ) {
          return;
        }

        hasLoops = true;

        const { variable, check } = generateLoopGuard(
          loopNumber,
          runItInstance.config.loopGuard.max,
        );
        if (node.body && node.body.type !== 'BlockStatement') {
          node.body = blockify(node.body);
        }

        node.body.body.unshift(check);

        const indexOfNode = parent.body.indexOf(node);

        parent.body.splice(indexOfNode, 0, variable);

        node.visited = true;

        loopNumber++;
      },
    });

    let guardedCode = code;
    if (hasLoops) {
      const generated = Astring.generate(guardedTree, {
        comments: true,
        sourceType: this.config.sourceType,
      });
      const formatted = this.format(generated);
      guardedCode = formatted;
    }

    return guardedCode;
  }

  async runIt(code = this.code) {
    code = await code;

    if (code === undefined) {
      return;
    }
    if (typeof code !== 'string') {
      // this should never happen, but just in case ....
      throw new TypeError('code is not a string');
    }

    const guardedCode =
      this.config.loopGuard.active === true ? this.loopGuard(code) : code;

    const finalCode = this.config.debug
      ? '/* ------------------------ */ debugger;\n\n\n\n\n' +
        guardedCode +
        '\n\n\n\n\n/* ------------------------ */ debugger;'
      : guardedCode;

    while (this.config.container.childElementCount !== 0) {
      this.config.container.removeChild(this.config.container.firstChild);
    }

    const evaller = document.createElement('iframe');
    evaller.style.display = 'none';
    evaller.id = Math.random();

    evaller.onload = () => {
      Object.assign(evaller.contentWindow, this.config.globals);

      const script = document.createElement('script');
      script.innerHTML = finalCode;

      if (this.config.type === 'module') {
        script.type = 'module';
      }

      evaller.contentDocument.body.appendChild(script);
    };

    // conditionally open iframe in new tab based on option
    this.config.container.appendChild(evaller);
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
        <style>
          .panel-element {
            display: inline-block;
          }

          .dropdown {
            /* width: 100%; */
            position: relative;
            display: inline-block;
          }

          .dropdown-content {
            display: none;
            position: absolute;
            background-color: #f9f9f9;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
            padding: 12px 16px;
            z-index: 100;
          }

          .dropdown:hover .dropdown-content {
            display: block;
          }
        </style>
        <div id='run-it-container'>
          <button id='run-it-button'>${this.config.text}</button>

          <div class="dropdown">
            <code>options</code>
            <div class='dropdown-content'>
              <form  id='run-it-config'>
                <input id='debug' type='checkbox' /> <label for='debug'>debug</label> <br>
                <input id='module' type='checkbox' /> <label for='module'>module</label> <br>
                <!-- <input id='new-tab' type='checkbox' /> <label for='new-tab'>new tab</label> <br> -->
                <input name='active' id='loop-guard-active' type='checkbox' /> <label for='loop-guard-active'>loop guard:</label>
                <input id='loop-guard-max' name='max' type='number' style='width: 3em;' />
              </form>
            </div>
          </div>
        </div>
        `;

    const runItButton = shadow.getElementById('run-it-button');
    // eventually: a convention for defining code source
    runItButton.addEventListener('click', () => this.runIt());

    const evalContainer = document.createElement('div');
    this.config.container = evalContainer;
    shadow.appendChild(evalContainer);

    const runItConfigEl = shadow.getElementById('run-it-config');

    runItConfigEl.addEventListener('change', (event) => {
      const target = event.target;

      if (target.id === 'loop-guard-active') {
        this.config.loopGuard.active = target.checked;
      } else if (target.id === 'loop-guard-max') {
        this.config.loopGuard.max = Number(target.value);
      } else if (target.id === 'module') {
        this.config.type = target.checked ? 'module' : 'script';
      } else if (target.id === 'debug') {
        this.config.debug = target.checked;
      }

      event.preventDefault();
    });

    for (const child of runItConfigEl.children) {
      if (child.nodeName !== 'INPUT') {
        continue;
      }
      if (child.id === 'loop-guard-active') {
        child.checked = this.config.loopGuard.active;
      } else if (child.id === 'loop-guard-max') {
        child.value = this.config.loopGuard.max;
      } else if (child.id === 'module') {
        child.checked = this.config.type === 'module';
      } else if (child.id === 'debug') {
        child.checked = this.config.debug;
      }
    }
  }
}

customElements.define('run-it', RunIt);
