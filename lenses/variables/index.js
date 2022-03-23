const scopeAnalysisLens = ({ resource, config }) => {
  let code = resource.content;
  let ext = resource.info.ext;

  if (typeof config.queryValue.code === 'string') {
    code = config.queryValue.code;
    ext = config.queryValue.ext || resource.info.ext;
  } else if (typeof resource.content !== 'string') {
    return;
  }

  if (ext !== '.js') {
    return;
  }
  if (!code) {
    return;
  }

  resource.info.ext = '.html';
  resource.content = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Shift Scope Analyser</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <link rel="icon" href="favicon.ico" />

    <link href="${config.ownStatic}/css/bootstrap.min.css" rel="stylesheet" />
    <link href="${
      config.ownStatic
    }/css/bootstrap-responsive.min.css" rel="stylesheet" />
    <link href="${config.ownStatic}/css/ribbon.css" rel="stylesheet" />
    <link href="${config.ownStatic}/css/css.css" rel="stylesheet" />
    <link href="${config.ownStatic}/css/demo.css" rel="stylesheet" />

    <link href="${config.ownStatic}/css/font.css" rel="stylesheet" />
    <!-- <link
      href="//fonts.googleapis.com/css?family=Source+Code+Pro:400,700"
      rel="stylesheet"
      type="text/css"
    /> -->

    <!-- ace editor -->
    <script src="${config.ownStatic}/vendor/ace-builds/src-min/ace.js"></script>
    <script src="${
      config.ownStatic
    }/vendor/ace-builds/src-min/mode-javascript.js"></script>
    <script src="${
      config.ownStatic
    }/vendor/ace-builds/src-min/theme-monokai.js"></script>


    <script type='module' src='${
      config.sharedStatic
    }/ask/component/ask-me.js'></script>

    <!-- <script src="${config.ownStatic}/js/shift-parser.js"></script> -->
    <script src="${config.sharedStatic}/shift/parser.js"></script>
    <script src="${config.ownStatic}/js/shift-codegen.js"></script>
    <script src="${config.ownStatic}/js/shift-scope.js"></script>

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

    <!-- trace -->
    <script src='${config.sharedStatic}/trace/aran-build.js'></script>
    <script src='${config.sharedStatic}/trace/index.js' type='module'></script>
    <script src="${config.sharedStatic}/trace/trace-init.js"></script>

    <style>
      #demo1 {
        resize: vertical;
      }
      #demo1 .editor {
        width: 50%;
        line-height: 15pt;
      }
      #demo1 .output-container {
        width: 100%;
        height: 100%;
      }
      .program-radio-label {
        font-size: medium;
      }
      #program-radio {
        margin-bottom: -10px;
      }
      .output {
        font-family: "Source Code Pro";
        font-size: 10pt;
        color: #666;
        line-height: 15pt;
        padding: 1px 0 0 5px;
      }
      .code-binding,
      .code-identifier {
        font-family: "Source Code Pro";
        font-size: 10pt;
        font-weight: bold;
        background-color: white;
        cursor: help;
        padding: 0 3px;
        border: 1px dotted #888;
        border-radius: 2px;
        color: black;
      }
      .var-read {
        background-color: #be171f;
        color: white;
      }
      .var-write {
        background-color: #78835b;
        color: white;
      }
      .var-read.var-write {
        background-color: #1a697a;
        color: white;
      }
      .var-decl {
        background-color: #f6a935;
        color: black;
      }
      .var-delete {
        background-color: #eee2ae;
        color: black;
      }
      .var-read,
      .var-write,
      .var-decl {
        border-color: black;
        border-style: solid;
      }
    </style>
  </head>

  <body>

    <!--

    <div class="ribbon-container right">
      <div class="ribbon">
        <a
          href="https://github.com/shapesecurity/shift-scope-js"
          target="_blank"
          >Fork me on GitHub</a
        >
      </div>
    </div>

    -->

    <div class="container">
      <div class="content">

        <!--
        <div class="masthead">
          <h3>
            <a href="./index.html" class="muted hub-link"
              >part of the Shift suite</a
            >
          </h3>
        </div>

        <div class="jumbotron">
          <h1><span class="shift">Shift</span> Scope Analyser</h1>
          <p class="lead">
            generates an ECMAScript program's scope tree from a Shift AST
          </p>
        </div>

        <hr />

        <section id="introduction">
          <h3>Introduction</h3>

          <p>
            The Shift Scope Analyser produces a data structure called a scope
            tree that represents all of the scoping information of a given
            program. Each element of the scope tree represents a single scope in
            the analysed program, and contains many pieces of information,
            including:
          </p>
          <ul>
            <li>the scope type (there are 12 of them!)</li>
            <li>the AST node associated with the scope</li>
            <li>
              variables declared within that scope, each of which points to its
              declarations and references
            </li>
            <li>
              whether the scope contains a <code>with</code> statement or direct
              call to eval, making it dynamic
            </li>
          </ul>
        </section>

        -->

        <section id="demo">
          <!-- <h3>Demo</h3> -->
          <!-- <h3>Scope Analysis</h3> -->

          <p>
            Mousing over any variable will highlight all uses of that variable, color-coded:
            <span class="code-identifier var-decl">declarations</span>,
            <span class="code-identifier var-read">read&nbsp;references</span>,
            <span class="code-identifier var-write">assignment&nbsp;references</span
            >,
            <span class="code-identifier var-read var-write"
              >read-assign&nbsp;references</span
            >, and <span class="code-identifier var-delete">deletes</span>.
          </p>

          <p id="program-radio" class="text-center" style="display: none;">
            <label class="radio inline program-radio-label">
              <input
                type="radio"
                name="program-radio"
                id="script-radio"
                value="script"
                checked
              />
              Script
            </label>
            <label class="radio inline program-radio-label">
              <input
                type="radio"
                name="program-radio"
                id="module-radio"
                value="module"
              />
              Module
            </label>
          </p>

          <div style='display: flex; flex-direction: row'>
            <trace-it></trace-it>
            <ask-me></ask-me>
          </div>

          <div class="demo" id="demo1">
            <div class="output-container">
              <div class="output" style="white-space: pre"></div>
              <div class="error-message"></div>
            </div>

            <div class="editor" spellcheck="false">${resource.content}</div>
            <script src="${config.ownStatic}/js/scope/main.js"></script>
          </div>
        </section>

        <!--

        <section id="installation">
          <h3>Installation</h3>

          <pre><code class="nohighlight">npm install shift-scope</code></pre>
        </section>

        <section id="usage">
          <h3>Usage</h3>

          <pre><code class="javascript">import analyze from "shift-scope";
let globalScope = analyze(/* Shift AST */);</code></pre>
        </section>

        -->

      </div>


      <hr />

      <div class="footer">
        <p>&copy; Shape Security, Inc.</p>

        <a
          href="https://github.com/shapesecurity/shift-scope-js"
          target="_blank"
          >Fork me on GitHub</a
        >
      </div>
    </div>
  </body>
</html>
`;

  return { resource };
};

module.exports = scopeAnalysisLens;
