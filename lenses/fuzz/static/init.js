import { testGenerator } from "./test-generator.js";
import { percentPass } from "./percent-pass.js";
// import { testRunner } from "./test-runner.js";

import { format } from "./format.js";

const tests = testGenerator({
  args: config.args,
  solution: config.solution,
  length: 100,
});

// testRunner(config.solution, tests, true);

const passingness = percentPass(config.solution, tests);

// console.log(passingness);

if (passingness.passing !== 100) {
  throw new Error(
    `this exercise is broken. it failed ${passingness.failing.length} tests out of ${tests.length}`
  );
}

config.starters.forEach((starter) => {
  const starterCode = format(`'use strict';\n\n${config.jsDoc}${starter.code}`);
  const model = monaco.editor.createModel(starterCode, "javascript");
  model.updateOptions({ tabSize: 2 });
  starter.model = model;
});

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

// --- setup alternate buttons ---

const starterButtons = Array.from(
  document.getElementsByClassName("starter-button")
);

const switchActive = (e) => {
  const index = Number(e.target.id);
  config.editor.setModel(config.starters[index].model);
  starterButtons.forEach((button, buttonIndex) => {
    if (buttonIndex === index) {
      button.style.backgroundColor = "black";
      button.style.color = "white";
    } else {
      button.style.backgroundColor = "white";
      button.style.color = "black";
    }
  });
};

starterButtons.forEach((button) => {
  button.addEventListener("click", switchActive);
});

starterButtons[0].click();
