import { CodeFE } from "../code/code-class.js";

export class P5FE extends CodeFE {
  liveRefresh = false;
  looping = true;
  trace = false;

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
  }

  initP5Ui() {
    const loopingCheckBox = document.getElementById("loop-checkbox");

    document.getElementById("refresh-button").addEventListener("click", () => {
      this.setup();
      this.looping = true;
      loopingCheckBox.checked = true;
    });

    loopingCheckBox.addEventListener("click", () => {
      if (this.looping) {
        noLoop();
      } else {
        loop();
      }
      this.looping = !this.looping;
    });

    document
      .getElementById("live-refresh-checkbox")
      .addEventListener("change", () => {
        if (this.liveRefresh) {
          this.editor.onDidChangeModelContent(() => {});
        } else {
          this.editor.onDidChangeModelContent(
            debounce(this.setup.bind(this), 500)
          );
        }
        this.liveRefresh = !this.liveRefresh;
      });

    document.getElementById("trace-checkbox").addEventListener("change", () => {
      this.trace = !this.trace;
    });
  }

  setup() {
    const errMsgCntId = "err-msg-cnt";
    try {
      const toRemove = document.getElementById(errMsgCntId);
      toRemove.parentElement.removeChild(toRemove);
    } catch (o_0) {
      // console.log(o_0);
    }
    const execute = eval;
    try {
      remove();
    } catch (o_0) {
      console.log(o_0);
    }
    try {
      if (this.trace) {
        execute(trace(this.editor.getValue(), true));
      } else {
        execute(this.editor.getValue());
      }
      new p5();
    } catch (err) {
      console.error(err);
      const errorMessageContainer = document.createElement("pre");
      errorMessageContainer.style =
        "color: firebrick; overflow: scroll; padding: 1em;";
      errorMessageContainer.innerHTML = `${err.name}: ${err.message}\n\n(see console for more callstack and more info)`;
      errorMessageContainer.id = errMsgCntId;
      const main = document.getElementsByTagName("main")[0];
      main.appendChild(errorMessageContainer);
    }
  }
}
