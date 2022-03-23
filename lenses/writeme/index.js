'use strict';

const writemeLens = ({ config, resource }) => {
  if (!resource.info && !config.queryValue.code) {
    return;
  }

  if (resource.info.ext !== '.js') {
    return;
  }

  let code = resource.content;
  let ext = resource.info.ext;

  if (typeof config.queryValue.code === 'string') {
    code = config.queryValue.code;
    ext = config.queryValue.ext || '';
  } else if (typeof resource.content !== 'string') {
    return;
  }

  if (!code) {
    return;
  }

  let start = 0;
  let end = code.split('\n').length;

  if (typeof config.queryValue.start === 'number') {
    start = config.queryValue.start;
  }

  if (typeof config.queryValue.end === 'number') {
    end = config.queryValue.end;
  }

  code = code
    .split('\n')
    .slice(start, end + 1)
    .join('\n');

  config.code = code;
  config.ext = ext;

  resource.info.ext = '.html';
  resource.content = `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title id='title'>${resource.info.dir}/${resource.info.base}</title>
  <link rel="icon" href="data:;base64,iVBORw0KGgo=">

  <link rel="stylesheet" data-name="vs/editor/editor.main" href="${
    config.sharedStatic
  }/monaco/min/vs/editor/editor.main.css">


  <script type="module">
    import { walk } from '${config.sharedStatic}/estree-walker/index.js'
    window.walk = walk;
  </script>

  <script src='${config.sharedStatic}/trace/aran-build.js'></script>


  <script type='module' src='${
    config.sharedStatic
  }/ask/component/ask-me.js'></script>


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
    <button id='change-theme-button' style='margin-right: 1em;'>change theme</button>
    ||
    <form id='role' style='margin-left: 1em;'>
      <input name='role' type='radio' id='write' checked/>
      <label for='write'>write</label>

      <input name='role' type='radio' id='read'/>
      <label for='read'>read</label>
    </form>
    <ask-me alert style='margin-left: 1em;'></ask-me>
  </div>

  <hr>


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

    const config = ${JSON.stringify(config, null, '  ')};

  </script>

  <script src='${config.sharedStatic}/lib/monaco-ext-to-language.js'></script>



  <script src='${config.ownStatic}/init.js'></script>



</body>

</html>
`;

  return {
    resource,
  };
};

module.exports = writemeLens;
