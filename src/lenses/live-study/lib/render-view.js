const renderView = (type, staticPrefix, config) => {

  return `<html>

<head>
  <meta charset="UTF-8">
  <title id='title'>${type}</title>
  <link rel="icon" href="data:;base64,iVBORw0KGgo=">

  <!-- $ {renderDependencyScripts(config.dependencies, config.path)} -->

</head>

<body>

  <div id='buttons-panel'></div>
  <div id='editor-container'></div>

  <link rel="stylesheet" data-name="vs/editor/editor.main" href="${staticPrefix}/public/monaco/min/vs/editor/editor.main.css">

  <script>var require = { paths: { 'vs': '${staticPrefix}/public/monaco/min/vs' } };</script>
  <script src="${staticPrefix}/public/monaco/min/vs/loader.js"></script>
  <script src="${staticPrefix}/public/monaco/min/vs/editor/editor.main.nls.js"></script>
  <script src="${staticPrefix}/public/monaco/min/vs/editor/editor.main.js"></script>

  <!--
  <script src="${staticPrefix}/public/static-study/monacoing.js"></script>
  <script src="${staticPrefix}/public/static-study/parsonize-selection.js"></script>
  <script src="${staticPrefix}/public/static-study/diff-selection.js"></script>

  <script src="${staticPrefix}/public/lib/strip-comments.js"></script>
  <script src="${staticPrefix}/public/lib/get-selection.js"></script>
  -->


  <script>

    const publicPrefix = "/${staticPrefix}/public";
    const config = ${JSON.stringify(config, null, '  ')};

  </script>


  <script type='module' src='${staticPrefix}/types/${type}/index.js'></script>


</body>

</html>
`};

module.exports = renderView;
