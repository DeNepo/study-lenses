import { CodeFE } from "../code/code-class.js";

import { domToPojo } from "./dom-to-pojo.js";
import { renderDomTree } from "./render-dom-tree.js";

export class HtmlFE extends CodeFE {
  constructor(config) {
    super(config);
    this.uiContainer = document.getElementById("ui-container");
    this.domContainer = document.getElementById("dom-container");
    this.initHtmlUi();
    this.editor.updateOptions({ readOnly: false });

    this.iframe = null;
    this.domTree = null;
    this.renderIFrame();
    this.view = "ui";
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
      // would be cool if the new tab was the same iframe, then state could persist
      // if (this.view === "ui") {
      const x = window.open();
      x.document.open();
      x.document.write(this.editor.getValue());
      x.document.close();

      if (document.getElementById("accessibility").checked) {
        const tota11yScript = document.createElement("script");
        tota11yScript.src = `${config.sharedStatic}/tota11y.min.js`;
        x.document.body.appendChild(tota11yScript);
      }
      // } else {
      //   const x = window.open();
      //   x.document.open();
      //   x.document.appendChild(this.domTree);
      //   x.document.close();
      // }
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
        if (event.target.checked) {
          editorContainer.style.display = "block";
          renderConfig.style.display = "block";
          this.uiContainer.style.width = "50vw";
          this.domContainer.style.width = "50vw";
        } else {
          editorContainer.style.display = "none";
          renderConfig.style.display = "none";
          this.uiContainer.style.width = "100vw";
          this.domContainer.style.width = "100vw";
        }
      });

    document
      .getElementById("accessibility")
      .addEventListener("change", (event) => {
        if (event.target.checked) {
          this.renderIFrame();
        }
      });

    document
      .getElementById("output-view")
      .addEventListener("change", (event) => {
        const view = event.target.id;

        if (view === "ui") {
          this.view = "ui";
          this.uiContainer.style.display = "inline-block";
          this.domContainer.style.display = "none";
        } else if (view === "dom") {
          this.view = "dom";
          this.uiContainer.style.display = "none";
          this.domContainer.style.display = "inline-block";
        }
      });

    // document
    //   .getElementById("loop-guard-form")
    //   .addEventListener("change", (event) => {
    //     this.config.loopGuard.active = event.target.form.active.checked;
    //     this.config.loopGuard.max = Number(event.target.form.max.value);
    //   });
  }

  renderDomTree(element) {
    const data = domToPojo(element);
    // console.log("new DOM:", data);
    this.domTree = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    this.domTree.style = "height: 100%; width: 100%;";
    this.domContainer.innerHTML = "";
    this.domContainer.appendChild(this.domTree);
    renderDomTree(data, this.domTree);
  }

  renderIFrame() {
    console.clear();

    const code = this.config.loopGuard.active
      ? this.loopGuardify(this.editor.getValue())
      : this.editor.getValue();

    this.iframe = document.createElement("iframe");
    this.iframe.id = "page-to-inspect";
    this.iframe.style = "height: 100%; width: 100%;";
    this.iframe.onload = () => {
      this.iframe.contentDocument.open();
      this.iframe.contentDocument.write(code);
      this.iframe.contentDocument.close();

      if (document.getElementById("accessibility").checked) {
        const tota11yScript = document.createElement("script");
        tota11yScript.src = `${config.sharedStatic}/tota11y.min.js`;
        this.iframe.contentDocument.body.appendChild(tota11yScript);
      }

      this.renderDomTree(this.iframe.contentDocument.body);

      const observerOptions = {
        childList: true,
        attributes: true,
        subtree: true,
      };

      const observer = new MutationObserver(() =>
        this.renderDomTree(this.iframe.contentDocument.body)
      );
      observer.observe(this.iframe.contentDocument.body, observerOptions);
    };

    this.uiContainer.innerHTML = "";
    this.uiContainer.appendChild(this.iframe);
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
