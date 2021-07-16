"use strict";

const generateUrl = require("./generate-url.js");

const openInLens = async ({ resource, config }) => {
  if (!resource.info && !resource.content) {
    return;
  }

  if (resource.info.ext !== ".js") {
    return;
  }

  if (typeof resource.content !== "string") {
    return;
  }

  if (!(config.queryValue in generateUrl)) {
    return;
  }

  const URL = generateUrl[config.queryValue](resource.content);

  resource.content = `
<!DOCTYPE html>
  <html>
  <head></head>
  <body>
    <code><pre>${resource.content}</pre></code>
    <script>
      const redirect = confirm("redirecting to ${config.queryValue} ...");
      if (redirect) {
        window.open("${URL}", "_self");
      }
    </script>
  </body>
</html>`;
  resource.info.ext = ".html";

  return {
    resource,
  };
};

module.exports = openInLens;
