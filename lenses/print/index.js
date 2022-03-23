'use strict';

const printLens = async ({ resource, config }) => {
  if (resource.info.type !== 'file') {
    return;
  }

  // console.log(resource.content);
  const queryValues = config.queryValue.split(' ');

  const language =
    resource.info.base && resource.info.base.includes('.pseudo')
      ? 'js'
      : resource.info.base && resource.info.base.includes('.lgo')
      ? 'js'
      : queryValues.find((entry) => entry.includes('lang-'))
      ? queryValues
          .find((entry) => entry.includes('lang-'))
          .replace('lang-', '')
      : resource.info.ext.replace('.', '');

  resource.content = `
<!DOCTYPE html>
  <html>
  <head>
    <link rel="stylesheet" href="${config.ownStatic}/prism.css">

  </head>
  <body>

    <div id='controls'>
      <form id='font-size' style='display: inline-block'>
        font size:
        <input type='range' min='0.5' max='1.5' value='1' step='0.001'  />
      </form>
      ||
      <button id='print'>print</button>
    </div>

    <div id="container">
      ${
        config.locals.code !== false
          ? `<div id="code-container">
          <pre><code id='code-goes-here' class="${
            queryValues.includes('nn') ? '' : 'line-numbers'
          } language-${
              queryValues.includes('bw') ? 'text' : language
            }"></code></pre>
        </div>`
          : ''
      }
      <div id="canvas-container" class="stacked"><canvas id="cfd"></canvas></div>
    </div>

    <script>
      var code = decodeURIComponent("${encodeURIComponent(
        typeof resource.content === 'object'
          ? JSON.stringify(resource.content, null, '  ')
          : resource.content,
      )}");
      var config = JSON.parse(decodeURIComponent("${encodeURIComponent(
        JSON.stringify(config),
      )}"));
    </script>

    <script src="${config.ownStatic}/prism.js"></script>

    <script>

      if (config.locals.code !== false) {
        // https://stackoverflow.com/a/24631113
        function escapeHTML(string) {
          var pre = document.createElement('pre');
          var text = document.createTextNode(string);
          pre.appendChild(text);
          return pre.innerHTML;
        }


        const codeGoesHere = document.getElementById('code-goes-here')
        codeGoesHere.innerHTML = escapeHTML(code)
        Prism.highlightAllUnder(codeGoesHere.parentElement);

      }
    </script>


    <script src="${config.ownStatic}/init.js"></script>


  </body>
</html>`;
  resource.info.ext = '.html';

  return {
    resource,
  };
};

module.exports = printLens;
