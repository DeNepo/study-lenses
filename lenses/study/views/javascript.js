'use strict'

const renderDependencies = require('../lib/render-dependencies')

const javascriptView = ({ config, resource }) => {
  return `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title id='title'>${resource.info.dir}/${resource.info.base}</title>
  <link rel="icon" href="data:;base64,iVBORw0KGgo=">

  <link rel="stylesheet" data-name="vs/editor/editor.main" href="${config.sharedStatic}/monaco/min/vs/editor/editor.main.css">

  ${renderDependencies(config.locals.dependencies, resource)}

</head>

<body>

  <div id='buttons-panel'></div>
  <div id='editor-container' style='height: 90vh'></div>


  <script>var require = { paths: { 'vs': '${config.sharedStatic}/monaco/min/vs' } };</script>
  <script src="${config.sharedStatic}/monaco/min/vs/loader.js"></script>
  <script src="${config.sharedStatic}/monaco/min/vs/editor/editor.main.nls.js"></script>
  <script src="${config.sharedStatic}/monaco/min/vs/editor/editor.main.js"></script>



  <script src='${config.sharedStatic}/lib/monaco-ext-to-language.js'></script>
  <script src='${config.sharedStatic}/lib/strip-comments.js'></script>

  <script src='${config.ownStatic}/lib/monacoing.js'></script>
  <script src='${config.ownStatic}/lib/get-monaco-selection.js'></script>
  <script src='${config.ownStatic}/lib/study-selection.js'></script>

  <script src='${config.ownStatic}/types/javascript/init.js'></script>

  <script>
    const config = ${JSON.stringify(config, null, '  ')};
    config.code = decodeURIComponent(config.code)
    initLiveStudy(config, document.getElementById('buttons-panel'), document.getElementById('editor-container'))
  </script>

</body>

</html>
`
}

module.exports = javascriptView
