'use strict'

/*
  config.queryValue: {
    // where to begin and end parsonizing
    startLine: 3,
    endLine: 4
    // this over-rides the resource, if provided
    code: 'asdf'
  }
*/


// JSON.parse(atob(decodeURIComponent(encodeURIComponent(btoa(JSON.stringify(f))))))

const parsonsLense = ({ resource, config }) => {

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

  console.log(config.queryValue)

  code = code.split('\n').slice(start, end + 1).join('\n')

  resource.content = `<html>

<head>
  <meta charset="UTF-8">
  <title id='title'></title>
  <link rel="icon" href="data:;base64,iVBORw0KGgo=">

  <link rel="stylesheet" href="${config.sharedStatic}/parsonizer/parsons.css">
  <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">

</head>

<body>

  <main id='parsons-container'></main>
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
    const code = strip(decodeURIComponent("${encodeURIComponent(code)}"))
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
