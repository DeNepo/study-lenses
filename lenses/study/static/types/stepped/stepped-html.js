import { HtmlFE } from "../html/html-class.js";

export class SteppedHtmlFE extends HtmlFE {
  constructor(config, steps) {
    window.steps = steps;
    super(config);

    for (const step of steps.steps) {
      const model = monaco.editor.createModel(step.code, "html");
      model.updateOptions({ tabSize: 2 });
      step.model = model;
    }

    this.initSteps("steps-container");
  }

  initSteps(containerId) {
    const stepButtons = document.getElementById(containerId);

    stepButtons.addEventListener("click", (event) => {
      const index = Number(event.target.id);
      const active = steps.steps[index];
      this.editor.setModel(active.model);
      this.renderIFrame();
      this.renderDomTree(this.iframe.contentDocument.body);
      Array.from(stepButtons.children).forEach((button, buttonIndex) => {
        if (buttonIndex === index) {
          button.style.backgroundColor = "black";
          button.style.color = "white";
          steps.steps[buttonIndex].active = true;
        } else {
          button.style.backgroundColor = "white";
          button.style.color = "black";
          steps.steps[buttonIndex].active = false;
        }
      });
    });

    if (stepButtons.children[0]) {
      stepButtons.children[0].click();
    } else {
      editor.setValue(`/*
  no steps yet, click the [+] button up there to start a new one.
*/`);
    }

    const saveChanges = (alertIt) => () => {
      const stepFileName = steps.steps.find((step) => step.active).fileName;

      const savePath = `${
        window.location.origin + window.location.pathname
      }/${stepFileName}?study`;
      console.log(savePath);
      fetch(savePath, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: this.editor.getValue(),
          fileName: stepFileName,
        }),
      })
        .then((response) => response.text())
        .then((message) => {
          alertIt ? alert(stepFileName + " " + message) : null;
          console.log(stepFileName + " " + message);
        })
        .catch((err) => {
          alert(err.name + ": " + err.message);
          console.error("Error:", err);
        });
    };

    if (config.locals.save === true) {
      const saveButton = document.getElementById("save-button");

      saveButton.removeEventListener("click", window.save);
      saveButton.addEventListener("click", saveChanges(true));
    }
  }

  initEditor() {
    const container = document.getElementById("editor-container");
    if (container === null) {
      return;
    }
    container.style.overflow = "hidden";
    // const readOnly = typeof this.config.readOnly === 'boolean'
    //   ? this.config.readOnly : false
    const readOnly = false;
    const options = Object.assign(
      {
        language: monacoExtToLanguage[this.config.stepsExt] || "",
        roundedSelection: true,
        scrollBeyondLastLine: true,
        theme: this.theme,
        wrappingIndent: "indent",
        wordWrap: "wordWrapColumn",
        wordWrapColumn: 100,
        automaticLayout: true,
        readOnly,
        tabSize: 2,
        scrollBeyondLastLine: true,
        wordWrap: "on",
        wrappingStrategy: "advanced",
        minimap: {
          enabled: false,
        },
        overviewRulerLanes: 0,
        // fontSize: 13,
      },
      config
    );
    this.editor = monaco.editor.create(container, options);

    this.editor.setValue(steps.steps[0].code || "");
    this.editor.layout();
    // https://github.com/microsoft/monaco-editor/issues/794#issuecomment-688959283
    this.editor.onDidChangeModelDecorations(() => {
      updateEditorHeight(); // typing
      requestAnimationFrame(updateEditorHeight); // folding
    });
    const lineHeight = this.editor.getOption(
      monaco.editor.EditorOption.lineHeight
    );
    const lineCount = this.editor.getModel()?.getLineCount() || 1;
    let prevHeight =
      this.editor.getTopForLineNumber(lineCount + 1) + lineHeight;
    const updateEditorHeight = () => {
      const editorElement = this.editor.getDomNode();
      if (!editorElement) {
        return;
      }
      const lineHeight = this.editor.getOption(
        monaco.editor.EditorOption.lineHeight
      );
      const lineCount = this.editor.getModel()?.getLineCount() || 1;
      const height =
        this.editor.getTopForLineNumber(lineCount + 1) + lineHeight;
      if (prevHeight !== height) {
        prevHeight = height;
        editorElement.style.height = `${height + 10}px`;
        this.editor.layout();
      }
    };
    updateEditorHeight();
  }
}
