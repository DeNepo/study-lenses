import { format } from "./format.js";
import { eslint } from "./eslint.js";

const setupSolution = (step) => {
  const stepCode = format(step.code);
  const model = monaco.editor.createModel(stepCode, "javascript");
  model.updateOptions({ tabSize: 2 });
  step.model = model;
  return step;
};
config.steps.forEach(setupSolution);

config.theme = "vs-dark";

config.editor = monaco.editor.create(
  document.getElementById("editor-container"),
  {
    language: "javascript",
    roundedSelection: true,
    scrollBeyondLastLine: false,
    theme: config.theme,
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
  }
);

window.editor = config.editor;

// --- configure button to run the correct code ---

const runItButton = document.getElementById("run-it-button");

runItButton.code = () => editor.getValue();

document.getElementById("lens-it-el").code = () => {
  const editorSelection = config.editor.getSelection();
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
    return config.editor.getValue();
  }

  let selection = "";
  const start = editorSelection.startLineNumber;
  const end = editorSelection.endLineNumber;
  const getFromThis =
    typeof config.editor.getModel === "function"
      ? config.editor.getModel()
      : config.editor;
  for (let i = start; i <= end; i++) {
    selection += getFromThis.getLineContent(i) + "\n";
  }

  return selection;
};

if (document.getElementById("open-in-button")) {
  document.getElementById("open-in-button").code = () =>
    config.editor.getValue();
}

// --- setup alternate buttons ---

const stepButtons = document.getElementById("step-buttons");

stepButtons.addEventListener("click", (event) => {
  const index = Number(event.target.id);
  const active = config.steps[index];
  config.editor.setModel(active.model);
  Array.from(stepButtons.children).forEach((button, buttonIndex) => {
    if (buttonIndex === index) {
      button.style.backgroundColor = "black";
      button.style.color = "white";
      config.steps[buttonIndex].active = true;
    } else {
      button.style.backgroundColor = "white";
      button.style.color = "black";
      config.steps[buttonIndex].active = false;
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

// --- save changes ---

const saveChanges = (alertIt) => () => {
  const stepFileName = config.steps.find((step) => step.active).fileName;

  fetch(window.location.origin + window.location.pathname + "?stepped", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: config.editor.getValue(),
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
  document
    .getElementById("save-button")
    .addEventListener("click", saveChanges(true));
}

// --- add new step ---

const fileNameRegex = /^(?!.*(?:\s))[\w\d-_.]*\.js$/g;

const createSolution = (fileName) => {
  const name = fileName
    .replace(/-./g, (x) => x[1].toUpperCase())
    .split(".js")
    .join("");

  return {
    code: `'use strict';\n`,
    fileName,
    name,
  };
};

// const newSolutionButton = document.getElementById("new-step-button");
// newSolutionButton.addEventListener("click", (event) => {
//   let fileName = "";
//   while (!fileName) {
//     const input = prompt("enter a file name for your new step");
//     if (input === null) {
//       return;
//     }

//     if (!fileNameRegex.test(input)) {
//       alert(`"${input}" is not a valid .js file name`);
//       continue;
//     }

//     if (config.steps.find((step) => step.fileName === input)) {
//       alert(`"${input}" already exists, pick a new name`);
//       continue;
//     }

//     fileName = input;
//   }

//   const buttonMaker = document.createElement("div");
//   buttonMaker.innerHTML = `<button class='step-button' id='${config.steps.length}'>${fileName}</button>`;
//   const newButton = buttonMaker.children[0];

//   stepButtons.appendChild(newButton);

//   config.steps.push(setupSolution(createSolution(fileName)));

//   newButton.click();

//   saveChanges(false)();
// });

// --- format button ---

document.getElementById("format-button").addEventListener("click", () => {
  // https://github.com/react-monaco-editor/react-monaco-editor/pull/212
  config.editor.executeEdits("", [
    {
      range: config.editor.getModel().getFullModelRange(),
      text: format(config.editor.getValue()),
      // forceMoveMarkers: true
    },
  ]);
});

document
  .getElementById("eslint-button")
  .addEventListener("click", () => eslint(config.editor.getValue()));
