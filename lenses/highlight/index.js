const highlightLense = async ({ resource, config }) => {
  // console.log(resource.content);
  resource.content = `
<!DOCTYPE html>
  <html>
  <head>
    <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">
    <script type='module' src='${
      config.sharedStatic
    }/ask/component/ask-me.js'></script>

    <script src='${
      config.sharedStatic
    }/wc-open-in/index.js' type='module'></script>

    <script src='${config.sharedStatic}/parsonizer/jquery.min.js'></script>
    <script src='${config.sharedStatic}/parsonizer/jquery-ui.min.js'></script>
    <script src='${
      config.sharedStatic
    }/wc-trace-table/configurable-button.js' type='module'></script>

    <script src='${config.ownStatic}/study-with.js'></script>

  </head>
  <body style="font-size: 0.9em;">

    ${
      config.locals.annotate === false
        ? ''
        : `<link rel="stylesheet" href="${config.ownStatic}/sketch-style.css">
        <button id="clear">Clear canvas</button>
        <button id="undo">Undo</button>
        <button id="redo">Redo</button>
        <input id="eraser" type="checkbox" />
        <label for="eraser">eraser</label>
        <br />
        <button id="white" class="color">WHITE</button>
        <button id="red" class="color">red</button>
        <button id="green" class="color">green</button>
        <button id="blue" class="color">blue</button>
        <button id="orange" class="color">orange</button>
        <button id="black" class="color">black</button>
        <br>`
    }

    ${
      (config.locals.run || config.locals.eval) && resource.info.ext === '.js'
        ? `
    <button style=";" onclick="studyWithEval(false)(decodeURIComponent(code))">run</button>`
        : ''
    }
    ${
      (config.locals.debug || config.locals.eval) && resource.info.ext === '.js'
        ? `
    <button style=";" onclick="studyWithEval(true)(decodeURIComponent(code))">debug</button>`
        : ''
    }
    ${
      config.locals.flowchart && resource.info.ext === '.js'
        ? `
    <button style=";" onclick="openWith(\`${encodeURIComponent(
      resource.content,
    )}\`, 'flowchart')">flowchart</button>`
        : ''
    }
    ${
      config.locals.diff && resource.info.ext === '.js'
        ? `
    <button style=";" onclick="openWith(\`${encodeURIComponent(
      resource.content,
    )}\`, 'diff')">diff</button>`
        : ''
    }

    ${
      config.locals.variables && resource.info.ext === '.js'
        ? `<button style=";" onclick="openWith( \`${encodeURIComponent(
            resource.content,
          )}\`, 'variables')">variables</button>`
        : ''
    }

    ${
      config.locals.trace && resource.info.ext === '.js'
        ? `<button style=";"><trace-it></trace-it></button>`
        : ''
    }

    ${
      config.locals.ask && resource.info.ext === '.js'
        ? `<button><ask-me style=''></ask-me></button>`
        : ''
    }


    ${
      config.locals.table
        ? `<button><trace-table-button></trace-table-button></button>`
        : ''
    }

    ${config.locals.openIn ? `<button><open-in></open-in></button>` : ''}

    ${`<button style="display: ${
      config.locals.random === false ? 'none' : 'inline-block'
    }" id="random-line">random line</button>`}

    <div id="container">
      ${
        config.locals.code !== false
          ? `<div id="code-container" class="stacked">
          <pre><code id='code-goes-here' class="line-numbers rainbow-braces language-${
            typeof resource.content === 'object'
              ? 'json'
              : (resource.info.base &&
                  resource.info.base.includes('.pseudo')) ||
                resource.info.ext.includes('.pseudo')
              ? 'pseudo'
              : (resource.info.base && resource.info.base.includes('.lgo')) ||
                resource.info.ext.includes('.lgo')
              ? 'js'
              : resource.info.ext.split('.').join('')
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
    <!-- <script src='${config.ownStatic}/init.js'></script> -->

    <script src="${config.sharedStatic}/prism/script.js"></script>
    <script src="${config.sharedStatic}/prism/toolbar.js"></script>
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


    ${
      config.locals.annotate === false
        ? ''
        : `<script src="${config.ownStatic}/cfd.js"></script>
    <script src="${config.ownStatic}/sketch-script.js"></script>`
    }

    <script src="${config.ownStatic}/open-with.js"></script>

    <script src="${config.ownStatic}/fake-editor.js"></script>


    <script src='${config.sharedStatic}/trace/aran-build.js'></script>
    <script src='${config.sharedStatic}/trace/index.js' type='module'></script>
    <script src='${
      config.sharedStatic
    }/trace/trace-init.js' type='module'></script>

    <script src='${config.ownStatic}/random-line.js'></script>

  </body>
</html>`;
  resource.info.ext = '.html';

  return {
    resource,
  };
};

module.exports = highlightLense;
