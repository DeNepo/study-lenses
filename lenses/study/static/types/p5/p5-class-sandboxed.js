// in progress: run it in an iframe

import { CodeFE } from "../code/code-class.js";

export class P5FE extends CodeFE {
  // looping = true;
  // trace = false;

  constructor(config) {
    super(config);
    this.initP5Ui();
    this.editor.updateOptions({
      readOnly: false,
      minimap: {
        enabled: false,
      },
    });
    setTimeout(this.setup.bind(this), 500);

    // for the ask-me button
    window.editor = this.editor;
  }

  initP5Ui() {
    // const loopingCheckBox = document.getElementById("loop-checkbox");

    const debouncedSetup = debounce(() => this.setup(), 500);

    // https://stackoverflow.com/questions/50405510/remove-listner-from-monaco-editor
    let disposable = {
      dispose: () => {},
    };
    document.getElementById("live").addEventListener("change", (event) => {
      const isChecked = event.target.checked;
      if (isChecked) {
        disposable = this.editor.onDidChangeModelContent(debouncedSetup);
      } else {
        disposable.dispose();
      }
    });

    document.getElementById("render-button").addEventListener("click", () => {
      this.setup();
    });

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

    document
      .getElementById("variables-button")
      .addEventListener("click", () => {
        this.openWith("variables", this.getSelection());
      });

    document
      .getElementById("flowchart-button")
      .addEventListener("click", () => {
        this.openWith("flowchart", this.getSelection());
      });

    document.getElementById("blanks-button").addEventListener("click", () => {
      this.openWith("blanks", this.getSelection());
    });
  }

  async setup(code = this.editor.getValue()) {
    const p5Source = await fetch(
      `${this.config.sharedStatic}/p5.min.js`
    ).then((res) => res.text());

    const p5SoundSource = await fetch(
      `${this.config.sharedStatic}/p5.sound.min.js`
    ).then((res) => res.text());

    const editorContainer = document.getElementById("editor-container");
    const renderConfig = document.getElementById("render-config");
    document
      .getElementById("editor-checkbox")
      .addEventListener("change", (event) => {
        const isChecked = event.target.checked;
        if (isChecked) {
          editorContainer.style.display = "block";
          renderConfig.style.display = "block";
        } else {
          editorContainer.style.display = "none";
          renderConfig.style.display = "none";
        }
      });

    const state = {
      step: { delay: 0, timeoutId: 0, min: 0, max: 2500 },
      slow: { delay: 500, timeoutId: 0, min: 0, max: 500 },
      delayMin: 0,
      delayMax: 1500,
      frameRate: 0,
    };

    const controls = document.getElementById("controls");

    const p5ing = {
      stepByStep: () => {},
      runAtSpeed: () => {},
      pause: () => {},
      looping: () => {},
    };

    const setup = (code) => {
      const p5Container = document.getElementById("p5-container");
      while (p5Container.childElementCount !== 0) {
        p5Container.removeChild(p5Container.firstChild);
      }

      const p5SourceScript = document.createElement("script");
      p5SourceScript.innerHTML = p5Source;

      const p5SoundSourceScript = document.createElement("script");
      p5SoundSourceScript.innerHTML = p5SoundSource;
      const codeScript = document.createElement("script");
      codeScript.innerHTML = code;

      const iframe = document.createElement("iframe");
      iframe.setAttribute("frameBorder", 0);
      iframe.onload = () => {
        iframe.contentDocument.body.appendChild(p5SourceScript);
        iframe.contentDocument.body.appendChild(p5SoundSourceScript);
        iframe.contentDocument.body.appendChild(codeScript);

        p5ing.stepByStep = () => {
          iframe.contentWindow.loop();
          state.step.timeoutId = setTimeout(() => {
            iframe.contentWindow.noLoop();
            pauseCheckbox.checked = true;
          }, state.step.delay);
        };
        p5ing.runAtSpeed = () => {
          if (controls.how.value !== "slow") {
            return;
          }
          if (iframe.contentWindow.isLooping()) {
            iframe.contentWindow.noLoop();
          }
          iframe.contentWindow.redraw();
          state.slow.timeoutId = setTimeout(runAtSpeed, state.slow.delay);
        };
        p5ing.pause = () => {
          clearTimeout(state.slow.timeoutId);
          iframe.contentWindow.noLoop();
        };
        p5ing.looping = () => {
          iframe.contentWindow.loop();
        };

        // const errMsgCntId = "err-msg-cnt";
        // try {
        //   const toRemove = iframe.contentDocument.getElementById(errMsgCntId);
        //   toRemove.parentElement.removeChild(toRemove);
        // } catch (o_0) {
        //   // console.log(o_0);
        // }
        const execute = eval;
        try {
          iframe.contentWindow.remove();
        } catch (o_0) {
          // console.log(o_0);
        }
        try {
          // if (document.getElementById("debug").checked === true) {
          execute(
            "/* -------------------------------------- */ debugger;\n\n\n\n\n" +
              code +
              "\n\n\n\n\n/* -------------------------------------- */ debugger;"
          );
          // } else {
          //   execute(code);
          // }
          // console.log(iframe.contentWindow.p5);
          new iframe.contentWindow.p5();
          if (controls.how.value === "step") {
            p5ing.stepByStep();
          } else if (controls.how.value === "slow") {
            p5ing.runAtSpeed();
          } else if (controls.how.value === "pause") {
            iframe.contentWindow.noLoop();
          }
        } catch (err) {
          console.error(err);
          const errorMessageContainer = document.createElement("pre");
          errorMessageContainer.style =
            "color: firebrick; overflow: scroll; padding: 1em;";
          errorMessageContainer.innerHTML = `${err.name}: ${err.message}\n\n(see console for more callstack and more info)`;
          p5Container.innerHTML = "";
          p5Container.appendChild(errorMessageContainer);
        }

        iframe.width = iframe.contentWindow.document.body.scrollWidth;
        iframe.height = iframe.contentWindow.document.body.scrollHeight;
      };
      p5Container.appendChild(iframe);
    };

    // initialize UI

    controls.addEventListener("submit", (e) => e.preventDefault());

    document.getElementById("restart-button").addEventListener("click", () => {
      setup(code);
    });

    // -------- pause ------------

    const pauseCheckbox = document.getElementById("pause");
    pauseCheckbox.addEventListener("click", p5ing.pause);

    // -------- looping ----------

    const loopingCheckbox = document.getElementById("loop");
    loopingCheckbox.addEventListener("click", p5ing.looping);

    // -------- debug ----------

    // document.getElementById("debug-button").addEventListener("click", () => {
    //   setup("debugger;\n\n" + code);
    // });

    // -------- step ----------

    const stepDelayInput = document.getElementById("delay-input");
    stepDelayInput.min = state.step.min;
    stepDelayInput.value = state.step.min;
    stepDelayInput.max = state.step.max;
    stepDelayInput.addEventListener("change", (event) => {
      state.step.delay = event.target.value;
    });

    document.getElementById("step").addEventListener("click", p5ing.stepByStep);

    // -------- slow ----------

    const slowDelayInput = document.getElementById("slow-input");
    slowDelayInput.min = state.slow.min;
    slowDelayInput.value = state.slow.min;
    slowDelayInput.max = state.slow.max;
    slowDelayInput.addEventListener("change", (event) => {
      state.slow.delay = state.slow.max - event.target.value;
    });

    const slowInput = document.getElementById("slow");
    slowInput.addEventListener("change", p5ing.runAtSpeed);

    setup(code);
  }

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
}
