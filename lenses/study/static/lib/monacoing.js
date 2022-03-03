const anEditor = ({
  container = document.createElement("div"),
  config = {},
}) => {
  container.style.width = config.editorWidth || "95%";
  container.style.overflow = "hidden";

  const readOnly =
    typeof config.readOnly === "boolean" ? config.readOnly : true;

  const options = Object.assign(
    {
      language: monacoExtToLanguage[config.ext] || "",
      roundedSelection: true,
      scrollBeyondLastLine: true,
      theme: "vs-dark",
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
    },
    config
  );

  const editor = monaco.editor.create(container, options);
  editor.setValue(config.code);

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

  return {
    editor,
    container,
    modelMaker,
    handlers: {
      toggleReadOnly,
      format,
      reset,
    },
  };
};
