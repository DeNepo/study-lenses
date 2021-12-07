let theme = "vs-dark";

const themeButton = document.getElementById("theme-button");
themeButton.addEventListener("click", () => {
  if (theme === "vs-dark") {
    editor.updateOptions({ theme: "vs-light" });
    theme = "vs-light";
  } else {
    editor.updateOptions({ theme: "vs-dark" });
    theme = "vs-dark";
  }
});

document.getElementById("format-button").addEventListener("click", () => {
  let formattedCode = "";
  try {
    // does not yet format code blocks in the file
    formattedCode = prettier.format(editor.getValue(), {
      parser: "markdown",
      plugins: prettierPlugins,
      printWidth: 80,
      proseWrap: "always",
      tabWidth: 2,
    });
  } catch (err) {
    console.error(err);
  }

  // https://github.com/react-monaco-editor/react-monaco-editor/pull/212
  editor.executeEdits("", [
    {
      range: editor.getModel().getFullModelRange(),
      text: formattedCode,
      // forceMoveMarkers: true
    },
  ]);
});

document
  .getElementById("reset-button")
  .addEventListener("click", () => editor.setValue(config.content || ""));

if (config.locals.save === true) {
  document.getElementById("save-button").addEventListener("click", () => {
    fetch(window.location.origin + window.location.pathname + "?render", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: editor.getValue() }),
    })
      .then((response) => response.text())
      .then((message) => {
        alert(message);
        console.log(message);
      })
      .catch((err) => {
        alert(err.name + ": " + err.message);
        console.error("Error:", err);
      });
  });
}

const container = document.getElementById("editor-container");

let editor = null;

if (container !== null) {
  container.style.overflow = "hidden";

  // const readOnly = typeof this.config.readOnly === 'boolean'
  //   ? this.config.readOnly : false
  const readOnly = false;

  const options = Object.assign(
    {
      language: monacoExtToLanguage[".md"] || "",
      roundedSelection: true,
      scrollBeyondLastLine: false,
      theme: theme,
      wrappingIndent: "indent",
      wordWrap: "wordWrapColumn",
      wordWrapColumn: 100,
      automaticLayout: true,
      readOnly,
      tabSize: 2,
      scrollBeyondLastLine: false,
      wordWrap: "on",
      wrappingStrategy: "advanced",
      minimap: {
        enabled: true,
      },
      overviewRulerLanes: 0,
      // fontSize: 13,
    },
    config
  );

  editor = monaco.editor.create(container, options);
  editor.setValue(config.content || "");
  editor.layout();

  // https://github.com/microsoft/monaco-editor/issues/794#issuecomment-688959283
  editor.onDidChangeModelDecorations(() => {
    updateEditorHeight(); // typing
    requestAnimationFrame(updateEditorHeight); // folding
  });

  const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
  const lineCount = editor.getModel()?.getLineCount() || 1;
  let prevHeight = editor.getTopForLineNumber(lineCount + 1) + lineHeight;

  const updateEditorHeight = () => {
    const editorElement = editor.getDomNode();

    if (!editorElement) {
      return;
    }

    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
    const lineCount = editor.getModel()?.getLineCount() || 1;
    const height = editor.getTopForLineNumber(lineCount + 1) + lineHeight;

    if (prevHeight !== height) {
      prevHeight = height;
      editorElement.style.height = `${height + 10}px`;
      editor.layout();
    }
  };
  updateEditorHeight();

  const renderMarkdown = (code) => {
    const outputContainer = document.getElementById("output-container");
    outputContainer.innerHTML = marked.parse(code);
    Prism.highlightAllUnder(outputContainer);
  };

  editor.onDidChangeModelContent(
    debounce(() => renderMarkdown(editor.getValue()), 500)
  );
}
