"use strict";

const diffScrambleLense = ({ config, resource }) => {
  if (!resource.info && !config.queryValue.code) {
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


    <div id='block-comments'></div>

  ${
    config.ext === ".js"
      ? `<div class='panel-element'>
      randomize non-keywords:<input id='randomize-variables' min='0' max='100' type='range' value='0' />
    </div><br>`
      : ""
  }
  <br>
  <form id='diff-selection-form' class='panel'>
    <p class='panel-element' style='padding-right: 1em'>
      shuffle: <br>
      replace:
    </p>
    <div class='panel-element'>
      indents: <br>
      <input name='indents-shuffle' min='0' max='100' type='range' value='0' /> <br>
      <input name='indents-replace' min='0' max='100' type='range' value='0' /> <br>
    </div>
    <!-- <div class='panel-element'>
      code: <br>
      <input name='code-shuffle' min='0' max='100' type='range' value='0' /> <br>
      <input name='code-replace' min='0' max='100' type='range' value='0' /> <br>
    </div> -->
    <div class='panel-element'>
      lines: <br>
      <input name='lines-shuffle' min='0' max='100' type='range' value='0' /> <br>
      <input name='lines-replace' min='0' max='100' type='range' value='0' /> <br>
    </div>
    <div class='panel-element'>
      tokens: <br>
      <input name='tokens-shuffle' min='0' max='100' type='range' value='0' /> <br>
      <input name='tokens-replace' min='0' max='100' type='range' value='0' /> <br>
    </div>
    <div class='panel-element'>
      characters: <br>
      <input name='characters-shuffle' min='0' max='100' type='range' value='0' /> <br>
      <input name='characters-replace' min='0' max='100' type='range' value='0' /> <br>
    </div>
  </form>
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

  <script src='${config.ownStatic}/scramblings.js'></script>
  <script src='${config.ownStatic}/randomize-variables.js'></script>
  <script src='${config.ownStatic}/monacoing.js'></script>
  <script src='${config.ownStatic}/init.js'></script>

  <script>init()</script>


</body>

</html>
`;

  return {
    resource,
  };
};

module.exports = diffScrambleLense;
