import { CodeFE } from '../code/code-class.js';
import { studyWith } from './static/study-with.js';

export class JavaScriptFE extends CodeFE {
  constructor(config) {
    super(config);

    if (
      this.config.base &&
      Array.isArray(this.config.locals.tests) &&
      this.config.locals.tests.find((matcher) =>
        new RegExp(matcher, 'i').test(this.config.base),
      )
    ) {
      // this.testedExtensions = this.config.locals.tests;
      // console.log(3);
      this.config.locals.tests = true;
      config.locals.tests = true;
    } else {
      this.config.locals.tests = false;
      config.locals.tests = false;
    }

    window.editor = this.editor;

    this.initJsUi();
  }

  initJsUi() {
    window.addEventListener('study', (event) => {
      const { selection, study } = event.detail;

      const code = selection
        ? getMonacoSelection(this.editor)
        : this.editor.getValue();

      try {
        study(code, { ...this.config });
      } catch (err) {
        console.log(err);
      }
    });

    const formatButton = document.getElementById('format-button');
    if (formatButton !== null) {
      const formatParent = formatButton.parentElement;
      const newFormatButton = document.createElement('button');
      newFormatButton.innerHTML = 'format';
      newFormatButton.onclick = () => {
        // https://github.com/react-monaco-editor/react-monaco-editor/pull/212
        this.editor.executeEdits('', [
          {
            range: this.editor.getModel().getFullModelRange(),
            text: this.prettierFormat(this.editor.getValue()),
            // forceMoveMarkers: true
          },
        ]);
      };
      formatParent.replaceChild(newFormatButton, formatButton);
    }

    const environmentForm = document.getElementById('environment-form');
    if (document.getElementById('environment-input')) {
      document
        .getElementById('environment-input')
        .addEventListener('change', (event) => {
          if (event.target.checked) {
            this.config.locals.environment = false;
            environmentForm.style = 'display: inline-block;';
          } else {
            this.config.locals.environment = true;
            environmentForm.style = 'display: none;';
          }
          event.preventDefault();
        });
    }
    if (environmentForm) {
      environmentForm.addEventListener('change', (event) => {
        const target = event.target;
        if (target.form.module.checked === true) {
          this.config.locals.type = 'module';
        } else {
          this.config.locals.type = 'text/javascript';
        }

        event.preventDefault();
        event.stopPropagation();
        // const target = event.target;
        // if (target.name === "strict" && this.config.locals.type !== "module") {
        //   this.config.locals.strict = !this.config.locals.strict;
        // } else if (
        //   target.name === "strict" &&
        //   this.config.locals.type === "module"
        // ) {
        //   target.form.strict.checked = true;
        //   event.preventDefault();
        //   event.stopPropagation();
        // } else {
        //   if (this.config.locals.type === "module") {
        //     this.config.locals.type = "text/javascript";
        //     environmentForm.strict.checked = this.config.locals.strict;
        //   } else {
        //     this.config.locals.type = "module";
        //     environmentForm.strict.checked = true;
        //   }
        // }
      });
    }

    // if (this.config.locals.loopGuard) {
    const loopGuardForm = document.getElementById('loop-guard-form');
    let lastActiveValue = this.config.locals.loopGuard
      ? this.config.locals.loopGuard.active
      : false;
    document
      .getElementById('loop-guard-input')
      .addEventListener('change', (event) => {
        if (event.target.checked) {
          this.config.locals.loopGuard.active = lastActiveValue;
          loopGuardForm.style = 'display: inline-block;';
        } else {
          lastActiveValue = this.config.locals.loopGuard.active;
          this.config.locals.loopGuard.active = false;
          loopGuardForm.style = 'display: none;';
        }
        event.preventDefault();
      });
    if (loopGuardForm) {
      loopGuardForm.addEventListener('change', (event) => {
        this.config.locals.loopGuard.active = event.target.form.active.checked;
        this.config.locals.loopGuard.max = Number(event.target.form.max.value);
      });
    }

    // }

    const testsForm = document.getElementById('tests-form');
    if (this.config.locals.tests === true && document.getElementById('tests')) {
      document.getElementById('tests').checked = true;
    }
    document
      .getElementById('tests-input')
      .addEventListener('change', (event) => {
        if (event.target.checked) {
          testsForm.style = 'display: inline-block;';
        } else {
          testsForm.style = 'display: none;';
        }
        event.preventDefault();
      });
    if (testsForm) {
      testsForm.addEventListener('change', (event) => {
        this.config.locals.tests = event.target.form.tests.checked;
      });
    }

    // if (this.config.locals.clearScheduled) {
    const clearScheduledButton = document.getElementById(
      'clear-scheduled-button',
    );
    document
      .getElementById('clear-scheduled-input')
      .addEventListener('change', (event) => {
        if (event.target.checked) {
          clearScheduledButton.style = 'display: inline-block;';
        } else {
          clearScheduledButton.style = 'display: none;';
        }
      });
    if (clearScheduledButton) {
      clearScheduledButton.addEventListener('click', clearScheduledFactory());
    }
    // }

    // if (this.config.locals.flowchart) {
    const flowchartButton = document.getElementById('flowchart-button');
    document
      .getElementById('flowchart-input')
      .addEventListener('change', (event) => {
        if (event.target.checked) {
          flowchartButton.style = 'display: inline-block;';
        } else {
          flowchartButton.style = 'display: none;';
        }
      });
    if (flowchartButton) {
      flowchartButton.addEventListener('click', () =>
        this.studyWith('flowchart', true),
      );
    }

    const pseudoButton = document.getElementById('pseudo-button');
    document
      .getElementById('pseudo-input')
      .addEventListener('change', (event) => {
        if (event.target.checked) {
          pseudoButton.style = 'display: inline-block;';
        } else {
          pseudoButton.style = 'display: none;';
        }
      });
    if (pseudoButton) {
      pseudoButton.addEventListener('click', () =>
        this.studyWith('pseudo&highlight', true),
      );
    }

    try {
      const depsButton = document.getElementById('deps-button');
      document
        .getElementById('deps-input')
        .addEventListener('change', (event) => {
          if (event.target.checked) {
            pseudoButton.style = 'display: inline-block;';
          } else {
            pseudoButton.style = 'display: none;';
          }
        });

      depsButton.addEventListener('click', () =>
        save().then(() =>
          window.open(
            `${window.location.origin}/${window.location.pathname}?deps`,
            '_blank',
          ),
        ),
      );
    } catch (o_0) {}

    // }

    const variablesButton = document.getElementById('variables-button');
    document
      .getElementById('variables-input')
      .addEventListener('change', (event) => {
        if (event.target.checked) {
          variablesButton.style = 'display: inline-block;';
        } else {
          variablesButton.style = 'display: none;';
        }
      });
    if (variablesButton) {
      variablesButton.addEventListener('click', () =>
        this.studyWith('variables', true),
      );
    }

    const writemeButton = document.getElementById('writeme-button');
    document
      .getElementById('writeme-input')
      .addEventListener('change', (event) => {
        this.config.writeme = !this.config.writeme;
        if (event.target.checked) {
          writemeButton.style = 'display: inline-block;';
        } else {
          writemeButton.style = 'display: none;';
        }
      });
    if (writemeButton) {
      writemeButton.addEventListener('click', () =>
        this.studyWith('writeme', true),
      );
    }

    const blanksButton = document.getElementById('blanks-button');
    document
      .getElementById('blanks-input')
      .addEventListener('change', (event) => {
        this.config.blanks = !this.config.blanks;
        if (event.target.checked) {
          blanksButton.style = 'display: inline-block;';
        } else {
          blanksButton.style = 'display: none;';
        }
      });
    if (blanksButton) {
      blanksButton.addEventListener('click', () =>
        this.studyWith('blanks', true),
      );
    }

    // const astButton = document.getElementById("ast-button");
    const astContainer = document.getElementById('ast-container');
    document.getElementById('ast-input').addEventListener('change', (event) => {
      if (event.target.checked) {
        astContainer.style = 'display: inline-block;';
      } else {
        astContainer.style = 'display: none;';
      }
    });
    // if (astButton) {
    //   astButton.addEventListener("click", () => this.studyWith("acorn"));
    // }

    const reContainer = document.getElementById('re-container');

    const runContainer = document.getElementById('run-container');
    document.getElementById('run-input').addEventListener('change', (event) => {
      this.config.locals.run = !this.config.locals.run;
      if (event.target.checked) {
        runContainer.style = 'display: inline-block;';
        this.config.hasRe && (reContainer.style = 'display: inline-block;');
      } else {
        runContainer.style = 'display: none;';
        this.config.hasRe && (reContainer.style = 'display: none;');
      }
    });

    const debugContainer = document.getElementById('debug-container');
    document
      .getElementById('debug-input')
      .addEventListener('change', (event) => {
        this.config.locals.debug = !this.config.locals.debug;
        if (event.target.checked) {
          debugContainer.style = 'display: inline-block;';
          this.config.hasRe && (reContainer.style = 'display: inline-block;');
        } else {
          debugContainer.style = 'display: none;';
          this.config.hasRe && (reContainer.style = 'display: none;');
        }
      });

    const reButton = document.getElementById('re-button');
    if (reButton && this.config.hasRe) {
      fetch(this.config.base.replace('.js', '.re.js'))
        .then((res) => res.text())
        .then((solution) => {
          document
            .getElementById('re-button')
            .addEventListener('click', () => studyWith.console(solution));
        })
        .catch((err) => console.error(err));
    }

    if (this.config.hasSpec === true && this.config.locals.save === true) {
      const runSpec = (debug) => async () => {
        try {
          // save changes
          await fetch(
            window.location.origin + window.location.pathname + '?study',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ text: this.editor.getValue() }),
            },
          )
            .then((response) => response.text())
            .then((message) => {
              console.log(message);
            })
            .catch((err) => {
              alert(err.name + ': ' + err.message);
              console.error('Error:', err);
            });

          // fetch spec
          const specCode = await fetch(
            (window.location.origin + window.location.pathname)
              .split('.js')
              .join('.spec.js'),
          ).then((res) => res.text());

          // eval spec
          debug
            ? studyWith.debugger(specCode, true)
            : studyWith.console(specCode, true);
        } catch (err) {
          console.error(err);
        }
      };

      const runButton = document.getElementById('run-button');
      if (runButton) {
        runButton.innerHTML = 'run spec';
        runButton.addEventListener('click', runSpec());
      }

      const debugButton = document.getElementById('debug-button');
      if (debugButton) {
        debugButton.innerHTML = 'debug spec';
        debugButton.addEventListener('click', runSpec(true));
      }
    } else {
      try {
        document
          .getElementById('run-button')
          .addEventListener('click', () => this.studyWith('console', false));
        document
          .getElementById('debug-button')
          .addEventListener('click', () => this.studyWith('debugger', false));
      } catch (o_0) {}
    }

    const eslintContainer = document.getElementById('eslint-container');
    document
      .getElementById('eslint-input')
      .addEventListener('change', (event) => {
        this.config.locals.eslint = !this.config.locals.eslint;
        if (event.target.checked) {
          eslintContainer.style = 'display: inline-block;';
        } else {
          eslintContainer.style = 'display: none;';
        }
      });

    if (document.getElementById('eslint-button')) {
      document
        .getElementById('eslint-button')
        .addEventListener('click', () => this.studyWith('eslint', true));
    }

    const p5Container = document.getElementById('p5-container');
    document.getElementById('p5-input').addEventListener('change', (event) => {
      this.config.locals.p5 = !this.config.locals.p5;
      if (event.target.checked) {
        p5Container.style = 'display: inline-block;';
      } else {
        p5Container.style = 'display: none;';
      }
    });

    const traceContainer = document.getElementById('trace-container');
    document
      .getElementById('trace-input')
      .addEventListener('change', (event) => {
        this.config.locals.trace = !this.config.locals.trace;
        if (event.target.checked) {
          traceContainer.style = 'display: inline-block;';
        } else {
          traceContainer.style = 'display: none;';
        }
      });

    const askContainer = document.getElementById('ask-container');
    document.getElementById('ask-input').addEventListener('change', (event) => {
      this.config.locals.ask = !this.config.locals.ask;
      if (event.target.checked) {
        askContainer.style = 'display: inline-block;';
      } else {
        askContainer.style = 'display: none;';
      }
    });

    const tableContainer = document.getElementById('table-container');
    document
      .getElementById('table-input')
      .addEventListener('change', (event) => {
        this.config.locals.table = !this.config.locals.table;
        if (event.target.checked) {
          tableContainer.style = 'display: inline-block;';
        } else {
          tableContainer.style = 'display: none;';
        }
      });

    if (document.getElementById('p5-button')) {
      document
        .getElementById('p5-button')
        .addEventListener('click', () => this.studyWith('p5'));
    }

    // }

    // if (this.config.locals.openIn) {
    const openInContainer = document.getElementById('open-in-container');
    document
      .getElementById('open-in-input')
      .addEventListener('change', (event) => {
        this.config.locals.openIn = !this.config.locals.openIn;
        if (event.target.checked) {
          openInContainer.style = 'display: inline-block;';
        } else {
          openInContainer.style = 'display: none;';
        }
      });

    if (document.getElementById('open-in-button')) {
      document
        .getElementById('open-in-button')
        .addEventListener('click', (event) => {
          const thisThing = event.target.form.thisThing.value;
          this.studyWith(thisThing, false);
          event.preventDefault();
        });
    }
    // }

    const configToString = () =>
      JSON.stringify({ study: config.locals }, null, '  ');

    document.getElementById('download-config').addEventListener('click', () => {
      const element = document.createElement('a');
      element.setAttribute('download', 'study.json');
      element.style.display = 'none';
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(configToString()),
      );

      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
    document.getElementById('copy-config').addEventListener('click', () => {
      const configString = configToString();

      navigator.clipboard.writeText(configString);

      setTimeout(() => {
        alert(`your configs are copied, they are also logged to the console`);
        console.log(configToString());
      }, 0);
    });

    if (this.config.locals.steamroll) {
      import('./static/steamroll.js')
        .then((e) => e.steamroll)
        .then((steamroll) => {
          document.getElementById('steam-it').addEventListener('click', () => {
            let code = this.editor.getValue();
            if (
              this.config.locals.loopGuard &&
              this.config.locals.loopGuard.active
            ) {
              try {
                const loopGuarded = JavaScriptFE.insertLoopGuards(
                  this.editor.getValue(),
                  this.config.locals.loopGuard.max || 20,
                );
                code = this.prettierFormat(loopGuarded);
              } catch (err) {
                // don't log the acorn error, let it be an eval error in the study type
              }
            }
            console.log('> steamrolled:', steamroll(code));
          });
          document.getElementById('roll-it').addEventListener('click', () => {
            let code = this.editor.getValue();
            if (
              this.config.locals.loopGuard &&
              this.config.locals.loopGuard.active
            ) {
              try {
                const loopGuarded = JavaScriptFE.insertLoopGuards(
                  this.editor.getValue(),
                  this.config.locals.loopGuard.max || 20,
                );
                code = this.prettierFormat(loopGuarded);
              } catch (err) {
                // don't log the acorn error, let it be an eval error in the study type
              }
            }
            console.log('> steamrolled:', steamroll(code, 'do it'));
          });
        })
        .catch((err) => console.error(err));
    }
  }

  // // previous version using regex
  // static insertLoopGuards = (evalCode, maxIterations) => {
  //   let loopNum = 0;
  //   const loopHeadRegex = /(for|while)([\s]*)\(([^\{]*)\)([\s]*)\{|do([\s]*)\{/gm;
  //   return evalCode.replace(loopHeadRegex, (loopHead) => {
  //     const id = ++loopNum;
  //     const newLine = `let loopGuard_${id} = 0\n${loopHead}\nif (++loopGuard_${id} > ${maxIterations}) { throw new RangeError('loopGuard_${id} is greater than ${maxIterations}') }\n`;
  //     return newLine;
  //   });
  // };

  static insertLoopGuards = (evalCode, maxIterations) => {
    const blockify = (...body) => {
      const blockStatement = Acorn.parse('{}').body[0];
      blockStatement.body = body;
      return blockStatement;
    };

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

    const ast =
      typeof evalCode === 'object'
        ? evalCode
        : Acorn.parse(evalCode, { locations: true });

    let hasLoops = false;

    let loopNumber = 1;

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
          maxIterations,
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

    const guarded =
      typeof evalCode === 'object'
        ? guardedTree
        : Astring.generate(guardedTree);

    return hasLoops ? guarded : evalCode;
  };

  prettierFormat(code = this.editor.getValue()) {
    let formattedCode = '';
    let noSyntaxErrors = false;
    try {
      formattedCode = prettier.format(code, {
        parser: 'babel',
        plugins: prettierPlugins,
        printWidth: 80,
        proseWrap: 'always',
        trailingComma: 'all',
        tabWidth: 2,
        semi: true,
        bracketSpacing: true,
        singleQuote: true,
      });
      noSyntaxErrors = true;
    } catch (err) {
      return code;
    }

    if (noSyntaxErrors) {
      return formattedCode;
    }
  }

  studyWith(environment, selection = true) {
    if (environment === 'acorn') {
      try {
        console.log(
          Acorn.parse(
            selection
              ? getMonacoSelection(this.editor)
              : this.editor.getValue(),
            { locations: true },
          ),
        );
      } catch (err) {
        console.error(err);
      }
      return;
    }

    let formatted = selection
      ? getMonacoSelection(this.editor)
      : this.editor.getValue();
    if (
      this.config.locals.loopGuard &&
      this.config.locals.loopGuard.active &&
      environment !== 'parsons' &&
      environment !== 'flowchart' &&
      environment !== 'diff' &&
      environment !== 'highlight' &&
      environment !== 'variables' &&
      environment !== 'writeme'
    ) {
      try {
        const loopGuarded = JavaScriptFE.insertLoopGuards(
          this.editor.getValue(),
          this.config.locals.loopGuard.max || 20,
        );
        formatted = this.prettierFormat(loopGuarded);
      } catch (err) {
        // don't log the acorn error, let it be an eval error in the study type
      }
      studyWith[environment](formatted);
      return;
    }

    if (environment === 'eslint') {
      const lintCode = (url) =>
        fetch(url)
          .then((res) => res.text())
          .then((lintResult) => console.log(lintResult))
          .catch((err) => console.error(err));

      // this.openWith(environment, this.editor.getValue(), lintCode);
      this.openWith(environment, editor.getValue(), lintCode);
    } else if (typeof studyWith[environment] === 'function') {
      studyWith[environment](formatted);
    } else {
      this.openSelectionWith(environment, formatted);
    }
  }
}
