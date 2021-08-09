"use strict";

const runLens = async ({ resource, config, requestData }) => {
  if (!resource.info && !resource.content) {
    return;
  }

  if (resource.info.ext !== ".js") {
    return;
  }

  if (typeof resource.content !== "string") {
    return;
  }

  const tests =
    (config.queryValue && /tests/i.test(config.queryValue)) ||
    requestData.path.includes(".spec.js") ||
    requestData.path.includes(".test.js");

  const debug = config.queryValue && /debug/i.test(config.queryValue);

  const scriptTag =
    config.queryValue && /module/i.test(config.queryValue)
      ? `<script type="module" src="${requestData.path}"></script>`
      : `<script src="${requestData.path}"></script>`;

  resource.content = `<!DOCTYPE html>
  <html>
  <head>
    <title>${requestData.path}</title>
  </head>
  <body>
    ${
      tests
        ? `<!-- set up environment or testing -->
    <script src='${config.sharedStatic}/testing/describe-it.js'> </script>
    <script> describeItify(window); </script>
    <script src='${config.sharedStatic}/testing/jest-matchers.js'> </script>
`
        : ""
    }
    ${
      debug
        ? `<script>debugger;</script>
`
        : ""
    }
    ${scriptTag}
  </body>
</html>`;
  resource.info.ext = ".html";

  return {
    resource,
  };
};

module.exports = runLens;
