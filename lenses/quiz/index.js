const marked = require("marked");

const prettier = require("prettier");

marked.setOptions({
  langPrefix: "line-numbers language-",
  gfm: true,
});

const quizLense = async ({ resource, config }) => {
  if (resource.info.ext !== ".md") {
    return resource;
  }

  try {
    resource.content = `
<!DOCTYPE html>
  <html>
  <head>
    <link rel="stylesheet" href="${config.sharedStatic}/gh-styles.css">
    <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">

    <link rel="stylesheet" href="${config.ownStatic}/no-copy.css">
  </head>
  <body>
    <trace-table-button></trace-table-button>
    <hr>
    <main class="markdown-body unselectable">${marked(
      prettier.format(resource.content, {
        parser: "markdown",
        proseWrap: "never",
      })
    )}</main>

    <script src="${config.sharedStatic}/prism/script.js"></script>
    <script src="${config.sharedStatic}/prism/toolbar.js"></script>
    <script src='${config.sharedStatic}/parsonizer/jquery.min.js'></script>
    <script src='${config.sharedStatic}/parsonizer/jquery-ui.min.js'></script>
    <script src="${
      config.sharedStatic
    }/wc-trace-table/configurable-button.js" type="module"></script>

    <script src="${config.ownStatic}/init.js"></script>
    <script src="${config.ownStatic}/pester.js"></script>
  </body>
</html>`;
    resource.info.ext = ".html";
  } catch (err) {
    console.log(err);
  }

  return {
    resource,
  };
};

module.exports = quizLense;
