'use strict';

const slidesLens = async ({ resource, config, lenses }) => {
  if (resource.info.ext !== '.md') {
    return resource;
  }

  config.locals = lenses.study.locals;

  resource.content = `
<!DOCTYPE html>
<html>
  <head>
    <title>${resource.info.base}</title>
    <meta charset="utf-8">

    <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">
    <link rel="stylesheet" href="${config.ownStatic}/styles.css">

    <script type="module" src="${
      config.sharedStatic
    }/web-components/study-lens.js"></script>
  </head>
  <body>
    <!-- <div class="help">
      <strong><code>"h" for shortcuts</code></strong>
    </div>
    <br> -->
    <div id='sandboxes' class="dropdown">
      <strong><code>&#187; sandboxes &#171;</code></strong>
      <div class='dropdown-content'>
        <div class='selection-buttons'>
          <a href='?--js' target='_blank'><button>javascript</button></a>
          <a href='?--html' target='_blank'><button>html</button></a>
          <a href='?--draw' target='_blank'><button>sketch pad</button></a>
        </div>
      </div>
    </div>

    <script src="${config.sharedStatic}/mermaid/index.js"></script>

    <script src="${config.ownStatic}/remark-latest.min.js"></script>

    <script>
      const config = JSON.parse(decodeURI("${encodeURI(
        JSON.stringify(config),
      )}"))

      remark.create({
        source: decodeURI("${encodeURI(resource.content)}"),
      });

      mermaid.initialize({
        startOnLoad: false,
      });
    </script>

    <script src="${config.sharedStatic}/prism/script.js"></script>
    <script src="${config.sharedStatic}/prism/toolbar.js"></script>

    <script type="module" src="${config.ownStatic}/init.js"></script>


    <script src='${config.sharedStatic}/trace/aran-build.js'></script>
    <script src='${config.sharedStatic}/trace/index.js' type='module'></script>
    <script src='${
      config.sharedStatic
    }/trace/trace-init.js' type='module'></script>
  </body>
</html>`;
  resource.info.ext = '.html';

  return {
    resource,
  };
};

module.exports = slidesLens;
