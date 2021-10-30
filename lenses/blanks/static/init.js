const editor = {};

const init = (() => {
  let isDiff = false;

  let closedEditor = null;

  let codeGenerated = "";

  let theme = "vs-dark";

  const initEditor = (blanked) => {
    let blankedModel = null;
    if (typeof blanked === "string") {
      const language = "javascript";

      blankedModel = monaco.editor.createModel(blanked, language);
      // const toScramble = monaco.editor.createModel(recompose(decompose(code)), language);
      blankedModel.updateOptions({ tabSize: 2 });
    } else {
      blankedModel = blanked;
    }

    const editorContainer = document.getElementById("editor-container");
    editorContainer.innerHTML = "";
    closedEditor = monaco.editor.create(editorContainer, {
      roundedSelection: true,
      scrollBeyondLastLine: false,
      theme,
      wrappingIndent: "indent",
      wordWrap: "wordWrapColumn",
      wordWrapColumn: 100,
      automaticLayout: true,
      originalEditable: true, // for left pane
      readOnly: false, // for right side
      enableSplitViewResizing: false,
      ignoreTrimWhitespace: false,
      language: "javascript",
      tabSize: 2,
    });

    closedEditor.setModel(blankedModel, "javascript");
    closedEditor.layout();

    closedEditor.style = "height:90vh; width:100vw;";
  };

  const initDiffEditor = (blanked, generated) => {
    const language = "javascript";

    let blankedModel = null;
    if (typeof blanked === "string") {
      blankedModel = monaco.editor.createModel(blanked, language);
      // const toScramble = monaco.editor.createModel(recompose(decompose(code)), language);
      blankedModel.updateOptions({ tabSize: 2 });
    } else {
      blankedModel = blanked;
    }

    const source = monaco.editor.createModel(generated, language);
    // const source = monaco.editor.createModel(code, language);
    source.updateOptions({ tabSize: 2 });

    const diffContainer = document.getElementById("editor-container");
    diffContainer.innerHTML = "";
    closedEditor = monaco.editor.createDiffEditor(diffContainer, {
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
    });
    closedEditor.setModel({
      original: blankedModel,
      modified: source,
    });

    closedEditor.style = "height:90vh; width:100vw;";
  };

  const blankingConfig = Object.assign(
    {},
    {
      keywords: true,
      identifiers: true,
      primitives: false,
      operators: false,
    },
    config.locals
  );

  const init = (probability = 0.1) => {
    const bestEffort = blankenate(config.code, probability, blankingConfig);

    if (bestEffort === null) {
      return;
    }
    const { generated, blanked, tokens, distractors } = bestEffort;

    codeGenerated = generated;
    editor.getValue = () => codeGenerated;

    initDiffEditor(blanked, generated);
    if (!document.getElementById("show-diff").checked) {
      document.getElementsByClassName("modified")[1].style.display = "none";
    }
    // document.getElementById("show-diff").checked
    //   ? initDiffEditor(blanked, generated)
    //   : initEditor(blanked);

    document.getElementById("tokens").innerHTML = `
    <details>
    <summary>expand for hints</summary>
      ${
        distractors.length > 0
          ? `<code>distractors: ${distractors.length}</code>`
          : ""
      }
      <ul>${tokens
        .map(
          (token) =>
            `<li><code>${token.name}</code> ${Array(token.count)
              .fill("<input type='checkbox' />")
              .join("")}</li>`
        )
        .join("")}</ul>
      </details>
      <br>`;
  };
  // console.log(config);

  const slider = document.getElementById("blankenate-variables");

  slider.onchange = () => {
    init(Number(slider.value) / 100);
  };

  document.getElementById("show-diff").onchange = (event) => {
    // this.editor.executeEdits("", [
    //   {
    //     range: this.editor.getModel().getFullModelRange(),
    //     text: this.prettierFormat(this.editor.getValue()),
    //     // forceMoveMarkers: true
    //   },
    // ]);
    // if (isDiff) {
    //   initEditor(closedEditor.getOriginalEditor().getModel());
    // } else {
    //   initDiffEditor(closedEditor.getModel(), codeGenerated);
    // }
    // isDiff = event.target.checked;

    isDiff = event.target.checked;

    const diffEditor = document.getElementsByClassName("modified")[1];

    if (isDiff) {
      diffEditor.style.display = "inline-block";
    } else {
      diffEditor.style.display = "none";
    }

    event.preventDefault();
  };

  document
    .getElementById("variables-button")
    .addEventListener("click", () => openWith(config.code, "variables"));

  document
    .getElementById("flowchart-button")
    .addEventListener("click", () => openWith(config.code, "flowchart"));

  document
    .getElementById("highlight-button")
    .addEventListener("click", () => openWith(config.code, "highlight"));

  document
    .getElementById("study-button")
    .addEventListener("click", () => openWith(config.code, "study"));

  document
    .getElementById("change-theme-button")
    .addEventListener("click", () => {
      theme = theme === "vs-dark" ? "vs-light" : "vs-dark";
      if (isDiff) {
        initDiffEditor(
          closedEditor.getOriginalEditor().getModel(),
          codeGenerated
        );
      } else {
        initEditor(closedEditor.getModel());
      }
    });

  const toggleBlankingConfig = (event) => {
    const whichOne = event.target.id;

    blankingConfig[whichOne] = !blankingConfig[whichOne];

    document.getElementById(whichOne).checked = blankingConfig[whichOne];

    init(Number(slider.value) / 100);
  };
  for (const key in blankingConfig) {
    const optionEl = document.getElementById(key);
    if (!optionEl) {
      continue;
    }
    optionEl.checked = blankingConfig[key];
    optionEl.addEventListener("change", toggleBlankingConfig);
  }

  return init;
})();
