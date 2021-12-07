"use strict";

const marked = require("marked");

marked.setOptions({
  langPrefix: "line-numbers language-",
});

const edit = ({ config, resource }) => {
  return `
<!DOCTYPE html>
  <html>
  <head>
    <link rel="stylesheet" href="${config.sharedStatic}/gh-styles.css">
    <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">

    <link rel="stylesheet" data-name="vs/editor/editor.main" href="${
      config.sharedStatic
    }/monaco/min/vs/editor/editor.main.css">
    <link rel='stylesheet' href='${config.ownStatic}/style.css' >


    <script src='${config.sharedStatic}/prettier/standalone.js'></script>
      <script src='${config.sharedStatic}/prettier/parser-markdown.js'></script>
  </head>
  <body>
    <div>
      <button id='format-button'>format</button>
      <button id='theme-button'>theme</button>
      <button id='reset-button'>reset</button>
      ${
        config.locals.save === true
          ? '<button id="save-button">save</button>'
          : ""
      }
    </div>

    <div id='resize-parent' style="display: flex; flex-direction: row;">
      <div id='editor-container' style='height: 95vh; width: 50vw'></div>
      <main id='output-container' style='height: 95vh; width: 50vw; overflow: scroll;' class="markdown-body">${marked(
        resource.content
      )}</main>
    </div>

    <script>
      const config = JSON.parse(decodeURIComponent("${encodeURIComponent(
        JSON.stringify(config)
      )}"))
    </script>


    <script src='${config.sharedStatic}/marked.min.js'></script>


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

    <script src="${config.sharedStatic}/prism/script.js"></script>
    <script src='${config.ownStatic}/init.js' type='module'></script>

    <script src='${config.sharedStatic}/lib/debounce.js'></script>
  </body>
</html>`;
};

module.exports = edit;
