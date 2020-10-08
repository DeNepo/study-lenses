const renderDependencies = require('./render-dependencies.js');

const renderView = (type, lenseConfig, liveStudyConfig) => {
  const { sharedStatic, ownStatic } = lenseConfig;

  return `<html>

<head>
  <meta charset="UTF-8">
  <title id='title'>${type}</title>
  <link rel="icon" href="data:;base64,iVBORw0KGgo=">

  ${liveStudyConfig.dependencies ? renderDependencies(liveStudyConfig.dependencies) : ''}

</head>

<body>

  <div id='controls-panel'></div>
  <div id='editor-container'></div>

  <link rel="stylesheet" data-name="vs/editor/editor.main" href="${sharedStatic}/monaco/min/vs/editor/editor.main.css">

  <script>var require = { paths: { 'vs': '${sharedStatic}/monaco/min/vs' } };</script>
  <script src="${sharedStatic}/monaco/min/vs/loader.js"></script>
  <script src="${sharedStatic}/monaco/min/vs/editor/editor.main.nls.js"></script>
  <script src="${sharedStatic}/monaco/min/vs/editor/editor.main.js"></script>


  <script>

    const config = ${JSON.stringify(liveStudyConfig, null, '  ')};

  </script>


  <script type='module' src='${ownStatic}/types/${type}/index.js'></script>


</body>

</html>
`};

module.exports = renderView;
