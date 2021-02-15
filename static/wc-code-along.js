class CodeAlongComponent extends HTMLElement {
  sourceCode = "";
  editor = null;
  editorContainer = null;
  loopGuard = false;
  jsTutor = false;

  constructor(code = "", config) {
    super();

    this.sourceCode = code;
    if (!config) {
      return;
    }
    if (config.loopGuard && typeof config.loopGuard === "object") {
      this.loopGuard = config.loopGuard;
    } else if (config.loopGuard === true) {
      this.loopGuard = {
        active: false,
        max: 50,
      };
    }
    if (config.openIn === "jsTutor" || config.openIn === "jsTutorLive") {
      this.jsTutor = true;
    }
    if (config.parsons) {
      this.parsons = true;
    }
    if (config.diff) {
      this.diff = true;
    }
    if (config.eval || config.run) {
      this.run = true;
    }

    if (config.trace) {
      this.trace = true;
    }
    if (config.eval || config.debug) {
      this.debug = true;
    }
    if (config.trace) {
      this.trace = true;
    }
  }

  openWith(lens) {
    const pseudoResource = {
      resource: {
        content: this.editor.getValue(),
        // hard-coding for now, assume this is only used with JS
        info: { ext: ".js" },
      },
    };

    const stringifiedResource = encodeURIComponent(
      JSON.stringify(pseudoResource)
    );

    const resourceQuery = `--resource=${stringifiedResource}`;

    const url = window.location.origin + `?${lens}&${resourceQuery}`;

    window.open(url, "_blank");
  }

  async connectedCallback() {
    if (this.hasAttribute("js-tutor")) {
      this.jsTutor = true;
    }

    if (this.hasAttribute("loop-guard")) {
      this.loopGuard = {
        active: false,
        max: 20,
      };
    }

    if (!this.sourceCode) {
      if (this.getAttribute("src")) {
        try {
          const res = await fetch(srcPath);
          this.sourceCode = await res.text();
        } catch (err) {
          console.error(err);
          return;
        }
      } else {
        const firstPre = this.getElementsByTagName("pre")[0];
        if (firstPre) {
          this.sourceCode = firstPre.innerText;
        }
      }
    }

    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.height = "inherit";
    buttonsContainer.style.width = "inherit";
    buttonsContainer.style.paddingTop = "1em";
    this.appendChild(buttonsContainer);

    if (this.run) {
      const consoleButton = document.createElement("button");
      consoleButton.innerHTML = "run";
      consoleButton.onclick = () => {
        eval("'use strict';" + this.editor.getValue());
      };
      buttonsContainer.appendChild(consoleButton);
    }
    if (this.trace) {
      const traceButton = document.createElement("button");
      traceButton.innerHTML = "trace";
      traceButton.onclick = () => {
        trace(this.editor.getValue());
      };
      buttonsContainer.appendChild(traceButton);
    }

    if (this.debug) {
      const debuggerButton = document.createElement("button");
      debuggerButton.innerHTML = "debug";
      debuggerButton.onclick = () =>
        eval(
          "debugger;\n\n'use strict' // just in case you forgot\n\n" +
            this.editor.getValue()
        );
      buttonsContainer.appendChild(debuggerButton);
    }

    if (this.trace) {
    }

    if (this.jsTutor) {
      const jsTutorButton = document.createElement("button");
      jsTutorButton.innerHTML = "JS Tutor";
      jsTutorButton.onclick = () => {
        const encodedJST = encodeURIComponent(this.code);
        const sanitizedJST = encodedJST
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%09/g, "%20%20");
        const jsTutorURL =
          "http://www.pythontutor.com/live.html#code=" +
          sanitizedJST +
          "&cumulative=false&curInstr=2&heapPrimitives=false&mode=display&origin=opt-live.js&py=js&rawInputLstJSON=%5B%5D&textReferences=false";
        window.open(jsTutorURL, "_blank");
      };
      buttonsContainer.appendChild(jsTutorButton);
    }

    if (this.loopGuard) {
      const loopGuardForm = document.createElement("form");
      loopGuardForm.style = "display: inline;";
      const idIdentifier = Math.random().toString(36).substring(7);
      loopGuardForm.innerHTML = `
      <input id='active-${idIdentifier}' name='active' name='active' type='checkbox' ${
        this.loopGuard.active ? "checked" : ""
      }/>
      <label for='active-${idIdentifier}'>loop guard</label>
      <input name='max' type='number' value='${
        this.loopGuard.max
      }' style='width: 3em;' />
    `;
      loopGuardForm.addEventListener("change", (event) => {
        this.loopGuard.active = event.target.form.active.checked;
        this.loopGuard.max = Number(event.target.form.max.value);
      });
      buttonsContainer.appendChild(loopGuardForm);
    }

    const highlightButton = document.createElement("button");
    highlightButton.innerHTML = "draw on";
    highlightButton.addEventListener("click", () => this.openWith("highlight"));
    buttonsContainer.appendChild(highlightButton);

    buttonsContainer.appendChild(document.createTextNode(" || "));

    const formatButton = document.createElement("button");
    formatButton.innerHTML = "format";
    formatButton.addEventListener("click", () => {
      // https://github.com/react-monaco-editor/react-monaco-editor/pull/212
      this.editor.executeEdits("", [
        {
          range: this.editor.getModel().getFullModelRange(),
          text: this.prettierFormat(this.editor.getValue()),
          forceMoveMarkers: true,
        },
      ]);
    });
    buttonsContainer.appendChild(formatButton);

    if (this.parsons) {
      const parsonsButton = document.createElement("button");
      parsonsButton.innerHTML = "parsonize selection";
      parsonsButton.onclick = () => {
        const code = this.getSelection();
        if (!code) {
          alert("no code selected");
          return;
        }

        const baseConfig = {
          code,
          ext: ".js",
        };
        const finalConfig = Object.assign(baseConfig, config.locals);
        const queryValue = encodeURIComponent(JSON.stringify(finalConfig));
        const query = `?parsons=${queryValue}`;
        const url = window.location.origin + query;

        window.open(url, "_blank");
      };
      buttonsContainer.appendChild(parsonsButton);
    }

    if (config.locals.flowchart) {
      const parsonsButton = document.createElement("button");
      parsonsButton.innerHTML = "flowchart";
      parsonsButton.onclick = () => {
        const baseConfig = {
          code: this.editor.getValue(),
          ext: ".js",
        };
        const finalConfig = Object.assign(baseConfig, config.locals);
        const queryValue = encodeURIComponent(JSON.stringify(finalConfig));
        const query = `?flowchart=${queryValue}`;
        const url = window.location.origin + query;

        window.open(url, "_blank");
      };
      buttonsContainer.appendChild(parsonsButton);
    }

    this.createEditor();
    this.editor.setValue(this.sourceCode);

    this.appendChild(document.createElement("br"));
    this.appendChild(this.editorContainer);

    try {
      Prism.highlightAllUnder;

      const highlightButton = document.createElement("button");
      highlightButton.innerText = "highlight";
      highlightButton.addEventListener("click", () => {
        // Prism.manual = true;
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.className = "language-js line-numbers";
        code.innerHTML = this.editor.getValue();
        pre.appendChild(code);
        this.parentElement.replaceChild(pre, this);

        Prism.highlightAllUnder(pre);
      });
      buttonsContainer.appendChild(document.createTextNode(" || "));
      buttonsContainer.appendChild(highlightButton);
    } catch (o_0) {}
  }

  get code() {
    const editorCode = this.editor.getValue();
    if (this.loopGuard && !this.loopGuard.active) {
      return editorCode;
    }

    let loopNum = 0;
    const loopHeadRegex = /(for|while)([\s]*)\(([^\{]*)\{|do([\s]*)\{/gm;
    const loopGuarded = editorCode.replace(loopHeadRegex, (loopHead) => {
      const id = ++loopNum;
      const newLine = `let loopGuard_${id} = 0\n${loopHead}\nif (++loopGuard_${id} > ${this.loopGuard.max}) { throw new RangeError('loopGuard_${id} is greater than ${this.loopGuard.max}') }\n`;
      return newLine;
    });
    const prettiereLoopGuarded = this.formatPrettier(loopGuarded);
    return prettiereLoopGuarded;
  }

  formatPrettier(code = this.editor.getValue()) {
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

  createEditor() {
    this.editorContainer = document.createElement("div");

    this.editorContainer.style.overflow = "hidden";
    this.editorContainer.style.height = "inherit";
    this.editorContainer.style.width = "inherit";

    this.editor = monaco.editor.create(this.editorContainer, {
      language: "javascript",
      roundedSelection: true,
      scrollBeyondLastLine: false,
      theme: "vs-dark",
      wrappingIndent: "indent",
      wordWrap: "wordWrapColumn",
      wordWrapColumn: 100,
      automaticLayout: true,
      tabSize: 2,
      scrollBeyondLastLine: false,
      wordWrap: "on",
      wrappingStrategy: "advanced",
      minimap: {
        enabled: false,
      },
      overviewRulerLanes: 0,
      fontSize: 14,
    });

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

      const lineHeight =
        this.editor.getOption(monaco.editor.EditorOption.lineHeight) + 1;
      const lineCount =
        (this.editor.getModel() && this.editor.getModel().getLineCount()) || 2;
      const height =
        this.editor.getTopForLineNumber(lineCount + 1) + lineHeight + 10;

      if (prevHeight !== height) {
        prevHeight = height;
        editorElement.style.height = `${height}px`;
        this.editor.layout();
      }
    };
    setTimeout(() => updateEditorHeight(), 100);
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
  getSelection(monacoThing) {
    const editorSelection = this.editor.getSelection();
    const editorSelectionEntries = Object.entries(editorSelection);
    const columnEntries = [];
    const lineEntries = [];
    for (const entry of editorSelectionEntries) {
      if (entry[0].includes("Column")) {
        columnEntries.push(entry);
      } else {
        lineEntries.push(entry);
      }
    }
    const firstLine = lineEntries[0][1];
    const firstColum = columnEntries[0][1];
    const noSelection =
      columnEntries.every((entry) => entry[1] === firstColum) &&
      lineEntries.every((entry) => entry[1] === firstLine);

    if (noSelection) {
      return "";
    }

    let selection = "";
    const start = editorSelection.startLineNumber;
    const end = editorSelection.endLineNumber;
    const getFromThis =
      typeof this.editor.getModel === "function"
        ? this.editor.getModel()
        : this.editor;
    for (let i = start; i <= end; i++) {
      selection += getFromThis.getLineContent(i) + "\n";
    }

    return selection;
  }
}

customElements.define("code-along", CodeAlongComponent);
