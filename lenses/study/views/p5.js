'use strict'

const renderDependencies = require('../lib/render-dependencies')

const p5View = ({ config, resource }) => {

  return `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title id='title'>${resource.info.dir}/${resource.info.base}</title>
  <link rel="icon" href="data:;base64,iVBORw0KGgo=">

  <link rel="stylesheet" data-name="vs/editor/editor.main" href="${config.sharedStatic}/monaco/min/vs/editor/editor.main.css">

  ${renderDependencies(config.dependencies, resource)}


  <script src="${config.sharedStatic}/p5.min.js"></script>
  <!-- <script src="${config.sharedStatic}/p5.sound.min.js"></script> -->

</head>

<body style='display: flex; flex-direction: row'>

  <div>
    <div id='buttons-panel'></div>
    <div id='editor-container' style='height: 90vh; width: 50vw'></div>
  </div>


  <script>var require = { paths: { 'vs': '${config.sharedStatic}/monaco/min/vs' } };</script>
  <script src="${config.sharedStatic}/monaco/min/vs/loader.js"></script>
  <script src="${config.sharedStatic}/monaco/min/vs/editor/editor.main.nls.js"></script>
  <script src="${config.sharedStatic}/monaco/min/vs/editor/editor.main.js"></script>


  <script src='${config.sharedStatic}/lib/monaco-ext-to-language.js'></script>
  <script src='${config.sharedStatic}/lib/debounce.js'></script>

  <script src='${config.ownStatic}/lib/monacoing.js'></script>
  <script src='${config.ownStatic}/lib/get-monaco-selection.js'></script>
  <script src='${config.ownStatic}/lib/study-selection.js'></script>

  <script src='${config.ownStatic}/types/p5/init.js'></script>


  <script>
    const config = ${JSON.stringify(config, null, '  ')};
    config.code = decodeURIComponent(config.code)
    initLiveStudy(config, document.getElementById('buttons-panel'), document.getElementById('editor-container'))
    // https://stackoverflow.com/questions/44109314/javascript-calculate-with-viewport-width-height
    // function vh(v) {
    //   var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    //   return (v * h) / 100;
    // }

    // function vw(v) {
    //   var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    //   return (v * w) / 100;
    // }
    function setup() {
      // const canvas = createCanvas(vw(50), vh(95));
      // canvas.parent('p5-drawing');
    }
  </script>


</body>

</html>
`
}

module.exports = p5View
