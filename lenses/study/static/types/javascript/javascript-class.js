import { CodeFE } from "../code/code-class.js";
import { studyWith } from "./static/study-with.js";

export class JavaScriptFE extends CodeFE {
  constructor(config) {
    super(config);

    if (
      this.config.base &&
      Array.isArray(this.config.locals.tests)
      // &&
      // this.config.locals.tests.find((matcher) =>
      //   new RegExp(matcher, "i").test(this.config.base)
      // )
    ) {
      // this.testedExtensions = this.config.locals.tests;
      this.config.locals.tests = true;
    }

    window.editor = this.editor;

    this.initJsUi();
  }

  initJsUi() {
    const formatButton = document.getElementById("format-button");
    if (formatButton !== null) {
      const formatParent = formatButton.parentElement;
      const newFormatButton = document.createElement("button");
      newFormatButton.innerHTML = "format";
      newFormatButton.onclick = () => {
        // https://github.com/react-monaco-editor/react-monaco-editor/pull/212
        this.editor.executeEdits("", [
          {
            range: this.editor.getModel().getFullModelRange(),
            text: this.prettierFormat(this.editor.getValue()),
            // forceMoveMarkers: true
          },
        ]);
      };
      formatParent.replaceChild(newFormatButton, formatButton);
    }

    const environmentForm = document.getElementById("environment-form");
    document
      .getElementById("environment-input")
      .addEventListener("change", (event) => {
        if (event.target.checked) {
          this.config.locals.environment = false;
          environmentForm.style = "display: inline-block;";
        } else {
          this.config.locals.environment = true;
          environmentForm.style = "display: none;";
        }
        event.preventDefault();
      });
    if (environmentForm) {
      environmentForm.addEventListener("change", (event) => {
        const target = event.target;
        if (target.form.module.checked === true) {
          this.config.locals.type = "module";
        } else {
          this.config.locals.type = "text/javascript";
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
    const loopGuardForm = document.getElementById("loop-guard-form");
    let lastActiveValue = this.config.locals.loopGuard.active;
    document
      .getElementById("loop-guard-input")
      .addEventListener("change", (event) => {
        if (event.target.checked) {
          this.config.locals.loopGuard.active = lastActiveValue;
          loopGuardForm.style = "display: inline-block;";
        } else {
          lastActiveValue = this.config.locals.loopGuard.active;
          this.config.locals.loopGuard.active = false;
          loopGuardForm.style = "display: none;";
        }
        event.preventDefault();
      });
    if (loopGuardForm) {
      loopGuardForm.addEventListener("change", (event) => {
        this.config.locals.loopGuard.active = event.target.form.active.checked;
        this.config.locals.loopGuard.max = Number(event.target.form.max.value);
      });
    }

    // }

    const testsForm = document.getElementById("tests-form");
    if (this.config.locals.tests === true && document.getElementById("tests")) {
      document.getElementById("tests").checked = true;
    }
    document
      .getElementById("tests-input")
      .addEventListener("change", (event) => {
        if (event.target.checked) {
          testsForm.style = "display: inline-block;";
        } else {
          testsForm.style = "display: none;";
        }
        event.preventDefault();
      });
    if (testsForm) {
      testsForm.addEventListener("change", (event) => {
        this.config.locals.tests = event.target.form.tests.checked;
      });
    }

    // if (this.config.locals.clearScheduled) {
    const clearScheduledButton = document.getElementById(
      "clear-scheduled-button"
    );
    document
      .getElementById("clear-scheduled-input")
      .addEventListener("change", (event) => {
        if (event.target.checked) {
          clearScheduledButton.style = "display: inline-block;";
        } else {
          clearScheduledButton.style = "display: none;";
        }
      });
    if (clearScheduledButton) {
      clearScheduledButton.addEventListener("click", clearScheduledFactory());
    }
    // }

    // if (this.config.locals.flowchart) {
    const flowchartButton = document.getElementById("flowchart-button");
    document
      .getElementById("flowchart-input")
      .addEventListener("change", (event) => {
        if (event.target.checked) {
          flowchartButton.style = "display: inline-block;";
        } else {
          flowchartButton.style = "display: none;";
        }
      });
    if (flowchartButton) {
      flowchartButton.addEventListener("click", () =>
        this.studyWith("flowchart")
      );
    }
    // }

    const variablesButton = document.getElementById("variables-button");
    document
      .getElementById("variables-input")
      .addEventListener("change", (event) => {
        if (event.target.checked) {
          variablesButton.style = "display: inline-block;";
        } else {
          variablesButton.style = "display: none;";
        }
      });
    if (variablesButton) {
      variablesButton.addEventListener("click", () =>
        this.studyWith("variables")
      );
    }

    const blanksButton = document.getElementById("blanks-button");
    document
      .getElementById("blanks-input")
      .addEventListener("change", (event) => {
        this.config.blanks = !this.config.blanks;
        if (event.target.checked) {
          blanksButton.style = "display: inline-block;";
        } else {
          blanksButton.style = "display: none;";
        }
      });
    if (blanksButton) {
      blanksButton.addEventListener("click", () => this.studyWith("blanks"));
    }

    const astButton = document.getElementById("ast-button");
    document.getElementById("ast-input").addEventListener("change", (event) => {
      if (event.target.checked) {
        astButton.style = "display: inline-block;";
      } else {
        astButton.style = "display: none;";
      }
    });
    if (astButton) {
      astButton.addEventListener("click", () => this.studyWith("acorn"));
    }

    const runContainer = document.getElementById("run-container");
    document.getElementById("run-input").addEventListener("change", (event) => {
      this.config.locals.run = !this.config.locals.run;
      if (event.target.checked) {
        runContainer.style = "display: inline-block;";
      } else {
        runContainer.style = "display: none;";
      }
    });

    const debugContainer = document.getElementById("debug-container");
    document
      .getElementById("debug-input")
      .addEventListener("change", (event) => {
        this.config.locals.debug = !this.config.locals.debug;
        if (event.target.checked) {
          debugContainer.style = "display: inline-block;";
        } else {
          debugContainer.style = "display: none;";
        }
      });

    if (this.config.hasSpec === true && this.config.locals.save === true) {
      const runSpec = (debug) => async () => {
        try {
          // save changes
          await fetch(
            window.location.origin + window.location.pathname + "?study",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ text: this.editor.getValue() }),
            }
          )
            .then((response) => response.text())
            .then((message) => {
              console.log(message);
            })
            .catch((err) => {
              alert(err.name + ": " + err.message);
              console.error("Error:", err);
            });

          // fetch spec
          const specCode = await fetch(
            (window.location.origin + window.location.pathname)
              .split(".js")
              .join(".spec.js")
          ).then((res) => res.text());

          // eval spec
          debug
            ? studyWith.debugger(specCode, true)
            : studyWith.console(specCode, true);
        } catch (err) {
          console.error(err);
        }
      };

      const runButton = document.getElementById("run-button");
      if (runButton) {
        runButton.innerHTML = "run spec";
        runButton.addEventListener("click", runSpec());
      }

      const debugButton = document.getElementById("debug-button");
      if (debugButton) {
        debugButton.innerHTML = "debug spec";
        debugButton.addEventListener("click", runSpec(true));
      }
    } else {
      document
        .getElementById("run-button")
        .addEventListener("click", () => this.studyWith("console"));
      document
        .getElementById("debug-button")
        .addEventListener("click", () => this.studyWith("debugger"));
    }

    const eslintContainer = document.getElementById("eslint-container");
    document
      .getElementById("eslint-input")
      .addEventListener("change", (event) => {
        this.config.locals.eslint = !this.config.locals.eslint;
        if (event.target.checked) {
          eslintContainer.style = "display: inline-block;";
        } else {
          eslintContainer.style = "display: none;";
        }
      });

    if (document.getElementById("eslint-button")) {
      document
        .getElementById("eslint-button")
        .addEventListener("click", () => this.studyWith("eslint"));
    }

    const p5Container = document.getElementById("p5-container");
    document.getElementById("p5-input").addEventListener("change", (event) => {
      this.config.locals.p5 = !this.config.locals.p5;
      if (event.target.checked) {
        p5Container.style = "display: inline-block;";
      } else {
        p5Container.style = "display: none;";
      }
    });

    const traceContainer = document.getElementById("trace-container");
    document
      .getElementById("trace-input")
      .addEventListener("change", (event) => {
        this.config.locals.trace = !this.config.locals.trace;
        if (event.target.checked) {
          traceContainer.style = "display: inline-block;";
        } else {
          traceContainer.style = "display: none;";
        }
      });

    const askContainer = document.getElementById("ask-container");
    document.getElementById("ask-input").addEventListener("change", (event) => {
      this.config.locals.ask = !this.config.locals.ask;
      if (event.target.checked) {
        askContainer.style = "display: inline-block;";
      } else {
        askContainer.style = "display: none;";
      }
    });

    const tableContainer = document.getElementById("table-container");
    document
      .getElementById("table-input")
      .addEventListener("change", (event) => {
        this.config.locals.table = !this.config.locals.table;
        if (event.target.checked) {
          tableContainer.style = "display: inline-block;";
        } else {
          tableContainer.style = "display: none;";
        }
      });

    if (document.getElementById("p5-button")) {
      document
        .getElementById("p5-button")
        .addEventListener("click", () => this.studyWith("p5"));
    }

    // }

    // if (this.config.locals.openIn) {
    const openInContainer = document.getElementById("open-in-container");
    document
      .getElementById("open-in-input")
      .addEventListener("change", (event) => {
        this.config.locals.openIn = !this.config.locals.openIn;
        if (event.target.checked) {
          openInContainer.style = "display: inline-block;";
        } else {
          openInContainer.style = "display: none;";
        }
      });

    if (document.getElementById("open-in-button")) {
      document
        .getElementById("open-in-button")
        .addEventListener("click", (event) => {
          const thisThing = event.target.form.thisThing.value;
          this.studyWith(thisThing);
          event.preventDefault();
        });
    }
    // }

    if (this.config.locals.steamroll) {
      import("./static/steamroll.js")
        .then((e) => e.steamroll)
        .then((steamroll) => {
          document.getElementById("steam-it").addEventListener("click", () => {
            let code = this.editor.getValue();
            if (
              this.config.locals.loopGuard &&
              this.config.locals.loopGuard.active
            ) {
              try {
                const loopGuarded = JavaScriptFE.insertLoopGuards(
                  this.editor.getValue(),
                  this.config.locals.loopGuard.max || 20
                );
                code = this.prettierFormat(loopGuarded);
              } catch (err) {
                // don't log the acorn error, let it be an eval error in the study type
              }
            }
            console.log("> steamrolled:", steamroll(code));
          });
          document.getElementById("roll-it").addEventListener("click", () => {
            let code = this.editor.getValue();
            if (
              this.config.locals.loopGuard &&
              this.config.locals.loopGuard.active
            ) {
              try {
                const loopGuarded = JavaScriptFE.insertLoopGuards(
                  this.editor.getValue(),
                  this.config.locals.loopGuard.max || 20
                );
                code = this.prettierFormat(loopGuarded);
              } catch (err) {
                // don't log the acorn error, let it be an eval error in the study type
              }
            }
            console.log("> steamrolled:", steamroll(code, "do it"));
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
      const blockStatement = Acorn.parse("{}").body[0];
      blockStatement.body = body;
      return blockStatement;
    };

    const generateLoopGuard = (id, max) => {
      const variable = Acorn.parse(`let loopGuard_${id} = 0;`).body[0];
      variable.generated = true;
      const check = Acorn.parse(
        `++loopGuard_${id}; if (loopGuard_${id} > ${max}) { throw new RangeError("loopGuard_${id} is greater than ${max}"); }`
      );
      check.generated = true;
      return {
        variable,
        check,
      };
    };

    const ast =
      typeof evalCode === "object"
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
          node.type !== "WhileStatement" &&
          node.type !== "ForStatement" &&
          node.type !== "ForOfStatement" &&
          node.type !== "ForInStatement" &&
          node.type !== "DoWhileStatement"
        ) {
          return;
        }

        hasLoops = true;

        const { variable, check } = generateLoopGuard(
          loopNumber,
          maxIterations
        );
        if (node.body && node.body.type !== "BlockStatement") {
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
      typeof evalCode === "object"
        ? guardedTree
        : Astring.generate(guardedTree);

    return hasLoops ? guarded : evalCode;
  };

  prettierFormat(code = this.editor.getValue()) {
    let formattedCode = "";
    let noSyntaxErrors = false;
    try {
      formattedCode = prettier.format(code, {
        parser: "babel",
        plugins: prettierPlugins,
      });
      noSyntaxErrors = true;
    } catch (err) {
      return code;
    }

    if (noSyntaxErrors) {
      return formattedCode;
    }
  }

  studyWith(environment, selection = false) {
    if (environment === "eslint") {
      const lintCode = (url) =>
        fetch(url)
          .then((res) => res.text())
          .then((lintResult) => console.log(lintResult))
          .catch((err) => console.error(err));

      this.openWith(environment, this.editor.getValue(), lintCode);
      return;
    }

    if (environment === "acorn") {
      try {
        console.log(
          Acorn.parse(
            selection
              ? getMonacoSelection(this.editor)
              : this.editor.getValue(),
            { locations: true }
          )
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
      environment !== "parsons" &&
      environment !== "flowchart" &&
      environment !== "diff" &&
      environment !== "highlight" &&
      environment !== "variables"
    ) {
      try {
        const loopGuarded = JavaScriptFE.insertLoopGuards(
          this.editor.getValue(),
          this.config.locals.loopGuard.max || 20
        );
        formatted = this.prettierFormat(loopGuarded);
      } catch (err) {
        // don't log the acorn error, let it be an eval error in the study type
      }
      studyWith[environment](formatted);
      return;
    }

    if (typeof studyWith[environment] === "function") {
      studyWith[environment](formatted);
    } else {
      this.openSelectionWith(environment, formatted);
    }
  }
}
