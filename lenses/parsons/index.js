'use strict'

// const prettier = require('prettier')

const commentRegex = require('comment-regex');

const parsonsLense = ({ resource, config }) => {

  if (!resource.info && !config.queryValue.code) {
    return
  }

  let code = resource.content
  let ext = resource.info.ext

  if (typeof config.queryValue.code === 'string') {
    code = config.queryValue.code
    ext = config.queryValue.ext || ''
  } else if (typeof resource.content !== 'string') {
    return
  }

  if (!code) {
    return
  }

  let start = 0
  let end = code.split('\n').length

  if (typeof config.queryValue.start === 'number') {
    start = config.queryValue.start
  }

  if (typeof config.queryValue.end === 'number') {
    end = config.queryValue.end
  }

  let frontendConfig = { ext }

  if (config.queryValue.hasOwnProperty('eval')) {
    frontendConfig.eval = config.queryValue.eval
  } else {
    frontendConfig.eval = config.locals.eval
  }

  if (config.queryValue.hasOwnProperty('openIn')) {
    frontendConfig.openIn = config.queryValue.openIn
  } else {
    frontendConfig.openIn = config.locals.openIn
  }

  if (config.queryValue.hasOwnProperty('loopGuard')) {
    frontendConfig.loopGuard = config.queryValue.loopGuard
  } else {
    frontendConfig.loopGuard = config.locals.loopGuard
  }



  code = code.split('\n').slice(start, end + 1).join('\n')

  // // /\/\*([\S\s]*?)\*\//gm
  // const blockComments = code.match(commentRegex.block());

  // if (ext === '.js') {
  //   code = prettier.format(code, { parser: "babel" })
  // }

  resource.content = `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title id='title'></title>
  <link rel="icon" href="data:;base64,iVBORw0KGgo=">

  <link rel="stylesheet" href="${config.sharedStatic}/parsonizer/parsons.css">
  <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">

  <script src='${config.sharedStatic}/prettier/standalone.js'></script>
  <script src='${config.sharedStatic}/prettier/parser-babel.js'></script>

</head>

<body>

  <div id='block-comments'></div>

  <main id='parsons-container' style='height: 100vh;'></main>
  <div id="history-modal" style="height:90vh; width:100vw;" class="modal-window">
    <a href="#modal-close" title="Close" class="modal-close">close &times;</a>
  </div>

  <script src="${config.sharedStatic}/prism/script.js"></script>

  <script src="${config.sharedStatic}/parsonizer/component.js"></script>
  <script src="${config.sharedStatic}/parsonizer/jquery.min.js"></script>
  <script src="${config.sharedStatic}/parsonizer/lis.js"></script>
  <script src="${config.sharedStatic}/parsonizer/jquery-ui.min.js"></script>
  <script src="${config.sharedStatic}/parsonizer/jquery.ui.touch-punch.min.js"></script>
  <script src="${config.sharedStatic}/parsonizer/parsons.js"></script>

  <script src="${config.sharedStatic}/lib/strip-comments.js"></script>

  <script>
    const config = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(frontendConfig))}"))
    const code = decodeURIComponent("${encodeURIComponent(code)}")
    const parsonsComponent = new JSParsons(code, "${ext.replace('.', '')}")
    document.getElementById('parsons-container')
      .appendChild(parsonsComponent)
  </script>

</body>

</html>
`
  resource.info.ext = '.html'

  return {
    resource
  }

}


module.exports = parsonsLense
