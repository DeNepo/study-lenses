"use strict";

const { convertCodeToSvg } = require("js2flowchart");

const flowchartLense = async ({ responseData, resource, config }) => {
  if (!resource.info && !config.queryValue.code) {
    return;
  }
  // console.log(resource);

  let code = resource.content;
  let ext = resource.info.ext;

  if (typeof config.queryValue.code === "string") {
    code = config.queryValue.code;
    ext = config.queryValue.ext || resource.info.ext;
  } else if (typeof resource.content !== "string") {
    return;
  }

  if (ext !== ".js") {
    return;
  }

  if (!code) {
    return;
  }

  let start = 0;
  let end = code.split("\n").length;

  if (typeof config.queryValue.start === "number") {
    start = config.queryValue.start;
  }

  if (typeof config.queryValue.end === "number") {
    end = config.queryValue.end;
  }

  code = code
    .split("\n")
    .slice(start, end + 1)
    .join("\n");

  try {
    const svg = convertCodeToSvg(code);
    resource.content = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
  </head>

  <body>
    <link rel="stylesheet" href="${config.ownStatic}/sketch-style.css">
    <button id="clear">Clear canvas</button>
    <button id="undo">Undo</button>
    <button id="redo">Redo</button>
    <br />
    <button id="white" class="color">White</button>
    <button id="red" class="color">Red</button>
    <button id="green" class="color">Green</button>
    <button id="blue" class="color">Blue</button>
    <button id="orange" class="color">Orange</button>
    <button id="black" class="color">Black</button>
    <br>
    <div id="container">
      <div id="code-container" class="stacked">
        ${svg}
      </div>
      <div id="canvas-container" class="stacked"><canvas id="cfd"></canvas></div>
    </div>
    <script src="${config.ownStatic}/cfd.js"></script>
    <script src="${config.ownStatic}/sketch-script.js"></script>
  </body>
</html>`;
    resource.info.ext = ".html";
  } catch (err) {
    resource.content =
      err.name +
      ": " +
      err.message +
      "\n\n- - - - - - - - - - - - - -\n\n" +
      code;
    resource.info.ext = ".txt";
    responseData.status = 500;
    console.error(err);
  }

  return {
    resource,
    responseData,
  };
};

module.exports = flowchartLense;
