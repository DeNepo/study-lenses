"use strict";

const fs = require("fs");
const path = require("path");

const util = require("util");
const readFilePromise = util.promisify(fs.readFile);
const readDirPromise = util.promisify(fs.readdir);

const marked = require("marked");

const renderFuzzercize = async (resource, config) => {
  const name = resource.info.base.replace(/-./g, (x) => x[1].toUpperCase());

  const basePath = path.join(
    resource.info.root,
    resource.info.dir,
    resource.info.base
  );

  let jsDoc = `/**
 *
 */`;
  const jsDocPath = path.join(basePath, "jsdoc.js");
  if (fs.existsSync(jsDocPath)) {
    jsDoc = await readFilePromise(jsDocPath, "utf-8");
  }

  let readme = null;
  const readmePath = path.join(basePath, "README.md");
  if (fs.existsSync(readmePath)) {
    readme = await readFilePromise(readmePath, "utf-8");
  }

  let renderedReadme = "";
  if (readme !== null) {
    marked.setOptions({
      baseUrl: `./${`${resource.info.dir}/${resource.info.base}`
        .split(path.sep)
        .join("/")}`,
      langPrefix: "line-numbers language-",
    });

    renderedReadme = `<div class='markdown-body'>${marked(readme)}</div>`;
  }

  const starters = [
    { name: "empty", code: `const ${name} = () => {};`, fileName: "empty.js" },
  ];
  const startersPath = path.join(basePath, "starters");
  if (fs.existsSync(startersPath) && fs.lstatSync(startersPath).isDirectory()) {
    const starterFileNames = await readDirPromise(startersPath);
    const starterCodes = await Promise.all(
      starterFileNames.map((fileName) =>
        readFilePromise(path.join(startersPath, fileName), "utf-8")
      )
    );
    starterFileNames.forEach((fileName, index) => {
      starters.unshift({
        fileName,
        name,
        code: starterCodes[index].split("__name__").join(name),
      });
    });
  }

  const fuzzercise = {
    name,
    jsDoc,
    readme,
    starters,
    fuzz: `./${resource.info.base}/fuzz.js`.split(path.sep).join("/"),
  };

  return `
<!DOCTYPE html>
  <html>
  <head>
    <link rel="stylesheet" data-name="vs/editor/editor.main" href="${
      config.sharedStatic
    }/monaco/min/vs/editor/editor.main.css">
  </head>
  <body>
    ${renderedReadme}
    <hr>
    <div id='starter-buttons'>
      ${fuzzercise.starters
        .map(
          (starter) =>
            `<button class='starter-button' id='${fuzzercise.starters.indexOf(
              starter
            )}'>${starter.fileName
              .split("-")
              .join(" ")
              .replace(".js", "")}</button>`
        )
        .join("")}
    </div>
    <hr>
    <div id='editor-container' style='height: 95vh'></div>
    <script type='module'>
      window.config = JSON.parse(decodeURI("${encodeURI(
        JSON.stringify(fuzzercise)
      )}"));

      Object.assign(config, await import(config.fuzz));
    </script>


    <script src='${config.sharedStatic}/prettier/standalone.js'></script>
    <script src='${config.sharedStatic}/prettier/parser-babel.js'></script>

    <script>var require = { paths: { 'vs': '${
      config.sharedStatic
    }/monaco/min/vs' } };</script>
    <script src="${config.sharedStatic}/monaco/min/vs/loader.js"></script>
    <script src="${
      config.sharedStatic
    }/monaco/min/vs/editor/editor.main.nls.js"></script>
    <script src="${
      config.sharedStatic
    }/monaco/min/vs/editor/editor.main.js"></script>

    <script src='${config.sharedStatic}/lib/monaco-ext-to-language.js'></script>

    <script src='${config.sharedStatic}/testing/describe-it.js'></script>
    <script src='${config.sharedStatic}/testing/jest-matchers.js'></script>



    <script type='module' src='${config.ownStatic}/init.js'></script>
  </body>
</html>`;
};

module.exports = renderFuzzercize;
