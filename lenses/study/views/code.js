'use strict'

const renderDependencies = require('../lib/render-dependencies')

const codeView = ({ config, resource, type }) => {
  return `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title id='title'>${resource.info.dir}/${resource.info.base}</title>
  <link rel="icon" href="data:;base64,iVBORw0KGgo=">

  <link rel="stylesheet" data-name="vs/editor/editor.main" href="${config.sharedStatic}/monaco/min/vs/editor/editor.main.css">

  ${renderDependencies(config.dependencies, resource)}

</head>

<body>

  <div id='buttons-panel'></div>
  <div id='editor-container'></div>


  <script>var require = { paths: { 'vs': '${config.sharedStatic}/monaco/min/vs' } };</script>
  <script src="${config.sharedStatic}/monaco/min/vs/loader.js"></script>
  <script src="${config.sharedStatic}/monaco/min/vs/editor/editor.main.nls.js"></script>
  <script src="${config.sharedStatic}/monaco/min/vs/editor/editor.main.js"></script>



  <script>

    const config = ${JSON.stringify(config, null, '  ')};

  </script>


  <script src='${config.ownStatic}/init.js'></script>
  <script src='${config.ownStatic}/types/${type}/index.js' type='module'></script>


</body>

</html>
`
}

module.exports = codeView
