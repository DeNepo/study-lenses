"use strict";

const JavaScriptSSR = require("../javascript");

const createSteppercise = require("./lib/create-steppercise");

const SteppedJavaScriptSSR = class extends JavaScriptSSR {
  constructor({ config, resource, stepsExt = ".js" }) {
    super({ config, resource });

    config.stepsExt = stepsExt;

    return new Promise((resolve) =>
      createSteppercise(this).then((steps) => {
        this.steps = steps;
        resolve(this);
      })
    );
  }

  panel() {
    const { steps } = this;
    const superPanel = super.panel();

    return superPanel.replace(
      "<br><br>",
      `<br>
      ${steps.renderedReadme ? steps.renderedReadme + "<hr>" : "<br>"}
    <div id='steps-container'>${steps.steps
      .map(
        (step) =>
          `<button class='step-button' id='${steps.steps.indexOf(step)}'>${
            step.fileName
          }</button>`
      )
      .join("")}</div>
    <hr>`
    );
  }

  scriptsBody() {
    const { steps } = this;
    const superScriptsBody = super.scriptsBody();

    return `${superScriptsBody}
    <script>
      const steps = JSON.parse(decodeURI(\`${encodeURI(
        JSON.stringify(steps)
      )}\`));
    </script>`;
  }
};

module.exports = SteppedJavaScriptSSR;
