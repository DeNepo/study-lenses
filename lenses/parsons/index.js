'use strict';

const parsonsTraceLens = require('./parsons-trace');

const parsonsDiff = require('./parsons-diff');

// const prettier = require('prettier')

const parsonsLense = ({ resource, config }) => {
  if (!resource.info && !config.queryValue.code && !config.queryValue.content) {
    return;
  }

  if (config.queryValue === 'trace') {
    return parsonsTraceLens({ resource, config });
  }

  if (config.queryValue === 'diff') {
    return parsonsDiff({ resource, config });
  }

  let code = resource.content;
  let ext = resource.info.ext;

  if (typeof config.queryValue.code === 'string') {
    code = config.queryValue.code;
    ext = config.queryValue.ext || '';
  } else if (typeof config.queryValue.content === 'string') {
    code = config.queryValue.content;
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

  let frontendConfig = { ext };

  if (config.queryValue.eval !== undefined) {
    frontendConfig.eval = config.queryValue.eval;
  } else {
    frontendConfig.eval = config.locals.eval;
  }
  if (config.queryValue.run !== undefined) {
    frontendConfig.run = config.queryValue.run;
  } else {
    frontendConfig.run = config.locals.run;
  }

  if (config.queryValue.study !== undefined) {
    frontendConfig.study = config.queryValue.study;
  } else {
    frontendConfig.study = config.locals.study;
  }

  if (config.queryValue.table !== undefined) {
    frontendConfig.table = config.queryValue.table;
  } else {
    frontendConfig.table = config.locals.table;
  }

  if (config.queryValue.trace !== undefined) {
    frontendConfig.trace = config.queryValue.trace;
  } else {
    frontendConfig.trace = config.locals.trace;
  }
  if (config.queryValue.debug !== undefined) {
    frontendConfig.debug = config.queryValue.debug;
  } else {
    frontendConfig.debug = config.locals.debug;
  }

  if (config.queryValue.openIn !== undefined) {
    frontendConfig.openIn = config.queryValue.openIn;
  } else {
    frontendConfig.openIn = config.locals.openIn;
  }

  if (config.queryValue.flowchart !== undefined) {
    frontendConfig.flowchart = config.queryValue.flowchart;
  } else {
    frontendConfig.flowchart = config.locals.flowchart;
  }

  if (config.queryValue.loopGuard !== undefined) {
    frontendConfig.loopGuard = config.queryValue.loopGuard;
  } else {
    frontendConfig.loopGuard = config.locals.loopGuard;
  }

  code = code
    .split('\n')
    .slice(start, end + 1)
    .join('\n');

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


  <script src='${config.sharedStatic}/prettier/standalone.js'></script>
  <script src='${config.sharedStatic}/prettier/parser-babel.js'></script>


  <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">
  <link rel="stylesheet" href="${config.sharedStatic}/parsonizer/parsons.css">

    <script src='${
      config.sharedStatic
    }/wc-trace-table/configurable-button.js' type='module'></script>


</head>

<body>


  <main id='parsons-container' style='height: 100vh;'></main>

  <script src="${config.sharedStatic}/prism/script.js"></script>

  <script src="${config.sharedStatic}/parsonizer/component.js"></script>
  <script src="${config.sharedStatic}/parsonizer/jquery.min.js"></script>
  <script src="${config.sharedStatic}/parsonizer/lis.js"></script>
  <script src="${config.sharedStatic}/parsonizer/jquery-ui.min.js"></script>
  <script src="${
    config.sharedStatic
  }/parsonizer/jquery.ui.touch-punch.min.js"></script>
  <script src="${config.sharedStatic}/parsonizer/parsons.js"></script>

  <script src="${config.sharedStatic}/lib/strip-comments.js"></script>

  <script>
    const config = JSON.parse(decodeURIComponent("${encodeURIComponent(
      JSON.stringify(frontendConfig),
    )}"))
    const code = decodeURIComponent("${encodeURIComponent(code)}")
    const parsonsComponent = new JSParsons(code, "${ext.replace('.', '')}")
    document.getElementById('parsons-container')
      .appendChild(parsonsComponent)
  </script>


  <script src='${config.sharedStatic}/trace/aran-build.js'></script>
  <script src='${config.sharedStatic}/trace/index.js' type='module'></script>



</body>

</html>
`;
  resource.info.ext = '.html';

  return {
    resource,
  };
};

module.exports = parsonsLense;
