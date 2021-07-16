// for ask-me
const editor = {
  getValue: () => config.code,
};

{
  let role = "write";
  let theme = "vs-dark";

  const emtpyModel = monaco.editor.createModel("", "javascript");
  // const toScramble = monaco.editor.createModel(recompose(decompose(code)), 'javascript');
  emtpyModel.updateOptions({ tabSize: 2 });

  const source = monaco.editor.createModel(config.code, "javascript");
  // const source = monaco.editor.createModel(code, 'javascript');
  source.updateOptions({ tabSize: 2 });

  const diffContainer = document.getElementById("editor-container");
  diffContainer.innerHTML = "";

  const diffEditor = monaco.editor.createDiffEditor(diffContainer, {
    roundedSelection: true,
    scrollBeyondLastLine: false,
    theme,
    wrappingIndent: "indent",
    wordWrap: "wordWrapColumn",
    wordWrapColumn: 100,
    automaticLayout: true,
    originalEditable: true, // for left pane
    readOnly: true, // for right side
    enableSplitViewResizing: false,
    ignoreTrimWhitespace: false,
    contextmenu: false,
    quickSuggestions: false,
  });
  diffEditor.updateOptions({
    tabSize: 2,
    minimap: {
      enabled: false,
    },
  });
  diffEditor.setModel({
    original: emtpyModel,
    modified: source,
  });

  diffEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_V, () => {});
  diffEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_C, () => {});

  diffEditor.style = "height:90vh; width:100vw;";

  // console.log(config);

  document.getElementById("role").onchange = (event) => {
    const newRole = event.target.id;
    if (newRole === role) {
      return;
    }
    role = newRole;

    const writing = document.getElementsByClassName("original")[1];
    const reading = document.getElementsByClassName("modified")[1];

    if (role === "write") {
      writing.style.display = "inline-block";
      reading.style.display = "none";
    } else {
      writing.style.display = "none";
      reading.style.display = "inline-block";
    }
    event.preventDefault();
  };

  document.getElementsByClassName("modified")[1].style.display = "none";

  document
    .getElementById("change-theme-button")
    .addEventListener("click", () => {
      theme = theme === "vs-dark" ? "vs-light" : "vs-dark";
      diffEditor.updateOptions({ theme });
    });
}
