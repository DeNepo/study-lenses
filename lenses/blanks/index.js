"use strict";

const blanksLens = ({ config, resource }) => {
  if (!resource.info && !config.queryValue.code) {
    return;
  }

  if (resource.info.ext !== ".js") {
    return;
  }

  let code = resource.content;
  let ext = resource.info.ext;

  if (typeof config.queryValue.code === "string") {
    code = config.queryValue.code;
    ext = config.queryValue.ext || "";
  } else if (typeof resource.content !== "string") {
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

  config.code = code;
  config.ext = ext;

  resource.info.ext = ".html";
  resource.content = `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title id='title'>${resource.info.dir}/${resource.info.base}</title>
  <link rel="icon" href="data:;base64,iVBORw0KGgo=">

  <link rel="stylesheet" data-name="vs/editor/editor.main" href="${
    config.sharedStatic
  }/monaco/min/vs/editor/editor.main.css">



  <script type='module' src='${
    config.sharedStatic
  }/ask/component/ask-me.js'></script>


  <script src='${config.sharedStatic}/prettier/standalone.js'></script>
  <script src='${config.sharedStatic}/prettier/parser-babel.js'></script>

  <script src='${config.sharedStatic}/parsonizer/jquery.min.js'></script>
  <script src='${config.sharedStatic}/parsonizer/jquery-ui.min.js'></script>
  <script src='${
    config.sharedStatic
  }/wc-trace-table/configurable-button.js' type='module'></script>

  <!-- <script src='${config.sharedStatic}/parsonizer/jquery.min.js'></script>
  <script src='${config.sharedStatic}/parsonizer/jquery-ui.min.js'></script>
  <script src='${
    config.sharedStatic
  }/wc-trace-table/configurable-button.js' type='module'></script> -->

  <script src='${config.ownStatic}/open-with.js'></script>

  <style>
    .panel-element {
      display: inline-block
    }
    .panel {
      display: flex;
      flex-direction: row;
    }
  </style>

</head>

<body>


  <div style='display: flex; flex-direction: row;'>
    <button id='change-theme-button'>change theme</button>||
    <button id='highlight-button'>highlight</button>
    <button id='variables-button'>variables</button>
    <button id='flowchart-button'>flowchart</button>
    <ask-me alert></ask-me>
    <trace-table-button></trace-table-button>
    <button id='study-button'>study</button>
  </div>
  <br>
  <div style='display: flex; flex-direction: row;'>
    <form style="padding-right: 0.5em;">
      <input id='identifiers' type='checkbox'><label for='identifiers'>identifiers</label>
      <input id='keywords' type='checkbox'><label for='keywords'>keywords</label>
      <input id='operators' type='checkbox'><label for='operators'>operators</label>
      <input id='primitives' type='checkbox'><label for='primitives'>primitives</label>
    </form>
    ||
    difficulty:<input style='width: 15em; margin-right: 0.5em;' id='blankenate-variables' min='0' max='100' type='range' value='0' />
    ||
    <form><input id='show-diff' style="padding-left: 0.5em;" type='checkbox'><label for='show-diff'>show diff </label> </form>
  </div>
  <br>
  <div id='tokens'></div>

  <div id='editor-container' style='height: 90vh'></div>


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



  <script>

    const config = ${JSON.stringify(config, null, "  ")};

  </script>

  <script src='${config.sharedStatic}/lib/monaco-ext-to-language.js'></script>
  <script src='${config.sharedStatic}/lib/strip-comments.js'></script>



  <script type="module">
    import { walk } from '${config.sharedStatic}/estree-walker/index.js'
    window.walk = walk;
  </script>

  <script src='${config.sharedStatic}/trace/aran-build.js'></script>


  <script src='${config.ownStatic}/get-distractors.js'></script>
  <script src='${config.ownStatic}/blanks-generator-keywords.js'></script>
  <script src='${config.ownStatic}/blanks-generator-operators.js'></script>
  <script src='${config.ownStatic}/blankenate.js'></script>


  <script src='${config.ownStatic}/init.js'></script>
  <script>setTimeout(init, 500, 0)</script>


</body>

</html>
`;

  return {
    resource,
  };
};

module.exports = blanksLens;
