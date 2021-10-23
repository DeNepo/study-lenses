const marked = require("marked");

marked.setOptions({
  langPrefix: "line-numbers language-",
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
    <main class="markdown-body unselectable">${marked(resource.content)}</main>

    <script src="${config.sharedStatic}/prism/script.js"></script>
    <script src="${config.sharedStatic}/prism/toolbar.js"></script>

    <script src="${config.ownStatic}/init.js"></script>
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
