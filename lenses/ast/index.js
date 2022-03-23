'use strict';

const astLens = ({ resource, config, lenses }) => {
  if (!resource.info && !resource.info.ext === '.js') {
    return;
  }

  if (typeof config.queryValue.content === 'string') {
    resource.content = config.queryValue.content;
  }

  lenses['ast-explorer'].queryValue = config.queryValue;

  return lenses['ast-explorer'].use();

  resource.content = `<!DOCTYPE html>
<html>
  <head>
    <!--Import Google Icon Font-->
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />
    <!--Import materialize.css-->
    <link
      type="text/css"
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css"
      media="screen,projection"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.8.1/themes/prism.css"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/CodeFlask.js/0.2.0/codeflask.css"
    />
    <link
      rel="stylesheet"
      href="${config.ownStatic}/styles.css"
    />

    <!--Let browser know website is optimized for mobile-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <script>
      var defaultCode = decodeURIComponent("${encodeURIComponent(
        resource.content,
      )}");
    </script>
  </head>

  <body>
    <!-- Navbar goes here -->
    <nav>
      <div class="nav-wrapper">
        <a href="index.html" class="brand-logo right">AST Visualizer</a>
        <ul id="nav-mobile" class="left">
          <li><a href="${
            config.ownStatic
          }/about.html" target="_blank">About Syntax Trees</a></li>
          <li><a href="https://github.com/viswesh/astVisualizer/" target=""_blank>Visualizer on GitHub</a></li>
        </ul>
      </div>
    </nav>

    <!-- Page Layout here -->
    <div class="row">
      <div class="col s12 m4 l3">
        <!-- Note that "m4 l3" was added -->
        <!-- Grey navigation panel

              This content will be:
          3-columns-wide on large screens,
          4-columns-wide on medium screens,
          12-columns-wide on small screens  -->
        <div id="my-code-wrapper" data-language="javascript"></div>
      </div>

      <div class="col s12 m8 l9">
        <!-- Note that "m8 l9" was added -->
        <!-- Teal page content

              This content will be:
          9-columns-wide on large screens,
          8-columns-wide on medium screens,
          12-columns-wide on small screens  -->
        <div class="row" overflow="scroll">
          <div class="col s12">
            <ul class="tabs">
              <li class="tab col s3">
                <a class="active" href="#test1">Tree</a>
              </li>
              <li class="tab col s3"><a href="#test2">Usage</a></li>
              <li class="tab col s3"><a href="#test3">AST</a></li>
            </ul>
          </div>
          <div id="test1" class="col s12" style="height: 100vh; width: 100%;"></div>
          <div id="test2" class="col s12"></div>
          <div id="test3" class="col s12">
            <div id="ast-wrapper" data-language="javascript"></div>
          </div>
        </div>
      </div>
    </div>

    <!--Import jQuery before materialize.js-->
    <script
      type="text/javascript"
      src="${config.ownStatic}/src/jquery-3.2.1.min.js"
    ></script>

    <script src="${
      config.ownStatic
    }/src/ajax/libs/materialize/0.100.2/js/materialize.js"></script>

    <script src="${
      config.ownStatic
    }/src/ajax/libs/CodeFlask.js/0.2.0/codeflask.min.js"></script>

    <script src="${
      config.ownStatic
    }/src/ajax/libs/prism/1.8.1/prism.min.js"></script>

    <!-- <script src="${
      config.ownStatic
    }/src/npm/esprima@4.0.1/dist/esprima.min.js"></script> -->


    <script src='${config.sharedStatic}/trace/aran-build.js'></script>

    <script src="${config.ownStatic}/src/vendor/ast-traverse.js"></script>

    <script src="${
      config.ownStatic
    }/src/ajax/libs/d3/4.11.0/d3.min.js"></script>

    <script src='${config.sharedStatic}/json-formatter.umd.js'></script>

    <script src="${config.ownStatic}/src/js/simplify-tree.js"></script>
    <script src="${config.ownStatic}/src/js/main.js"></script>
  </body>
</html>
`;
  resource.info.ext = '.html';

  return {
    resource,
  };
};

module.exports = astLens;
