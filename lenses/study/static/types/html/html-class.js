import { CodeFE } from "../code/code-class.js";

export class HtmlFE extends CodeFE {
  constructor(config) {
    super(config);
    this.outputContainer = document.getElementById("output-container");
    this.initHtmlUi();
    this.editor.updateOptions({ readOnly: false });

    this.renderIFrame();
  }

  initHtmlUi() {
    const formatButton = document.getElementById("format-button");
    const formatParent = formatButton.parentElement;
    const newFormatButton = document.createElement("button");
    newFormatButton.innerHTML = "format";
    newFormatButton.onclick = () => {
      // https://github.com/react-monaco-editor/react-monaco-editor/pull/212
      this.editor.executeEdits("", [
        {
          range: this.editor.getModel().getFullModelRange(),
          text: HtmlFE.format(this.editor.getValue()),
          // forceMoveMarkers: true
        },
      ]);
    };
    formatParent.replaceChild(newFormatButton, formatButton);

    document.getElementById("new-tab-button").addEventListener("click", () => {
      const x = window.open();
      x.document.open();
      if (this.config.loopGuard.active) {
        x.document.write(this.loopGuardify(this.editor.getValue()));
      } else {
        x.document.write(this.editor.getValue());
      }
      x.document.close();
    });

    document
      .getElementById("render-button")
      .addEventListener("click", () => this.renderIFrame());

    // https://stackoverflow.com/questions/50405510/remove-listner-from-monaco-editor
    let disposable = {
      dispose: () => {},
    };
    document.getElementById("live").addEventListener("change", (event) => {
      const isChecked = event.target.checked;
      if (isChecked) {
        disposable = this.editor.onDidChangeModelContent(
          debounce(this.renderIFrame.bind(this), 500)
        );
      } else {
        disposable.dispose();
      }
    });

    const editorContainer = document.getElementById("editor-container");
    const renderConfig = document.getElementById("render-config");
    document
      .getElementById("editor-checkbox")
      .addEventListener("change", (event) => {
        const isChecked = event.target.checked;
        if (isChecked) {
          editorContainer.style.display = "block";
          renderConfig.style.display = "block";
          this.outputContainer.style.width = "40vw";
        } else {
          editorContainer.style.display = "none";
          renderConfig.style.display = "none";
          this.outputContainer.style.width = "100vw";
        }
      });

    // document
    //   .getElementById("loop-guard-form")
    //   .addEventListener("change", (event) => {
    //     this.config.loopGuard.active = event.target.form.active.checked;
    //     this.config.loopGuard.max = Number(event.target.form.max.value);
    //   });
  }

  renderIFrame() {
    console.clear();

    const code = this.config.loopGuard.active
      ? this.loopGuardify(this.editor.getValue())
      : this.editor.getValue();

    const iframe = document.createElement("iframe");
    iframe.style = "height: 100%; width: 100%;";
    iframe.onload = () => {
      iframe.contentDocument.open();
      iframe.contentDocument.write(code);
      iframe.contentDocument.close();
    };
    this.iframe = iframe;

    this.outputContainer.innerHTML = "";
    this.outputContainer.appendChild(iframe);
  }

  static format(code) {
    try {
      const formattedCode = prettier.format(code, {
        parser: "html",
        plugins: prettierPlugins,
      });
      return formattedCode;
    } catch (o_0) {
      return code;
    }
  }

  static insertLoopGuards = (evalCode, maxIterations) => {
    let loopNum = 0;
    return evalCode.replace(
      /(for|while)([\s]*)\(([^\{]*)\)([\s]*)\{|do([\s]*)\{/gm,
      (loopHead) => {
        const id = ++loopNum;
        return `let loopGuard_${id} = 0\n${loopHead}\nif (++loopGuard_${id} > ${maxIterations}) { throw new RangeError('loopGuard_${id} is greater than ${maxIterations}') }\n`;
      }
    );
  };

  loopGuardify(code) {
    const loopGuarded = HtmlFE.insertLoopGuards(
      code,
      this.config.loopGuard.max || 20
    );

    return HtmlFE.format(loopGuarded);
  }
}
