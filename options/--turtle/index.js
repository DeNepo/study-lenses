const turtleOption = async ({ config, resource }) => {
  resource.info.ext = '.html';
  resource.content = `<html>
  <head>
    <title>turtle</title>

    <link href="${config.ownStatic}/style.css" rel="stylesheet" />
  </head>
  <body>
    <script src="${config.sharedStatic}/p5.min.js"></script>
    <script type="module" src="${config.ownStatic}/main.js"></script>

    <a href="https://github.com/kredati/dirty-turtle" target="_blank" class="crediti">Dirty Turtle by kredati</a>
  </body>
</html>`;

  return { resource };
};

module.exports = turtleOption;
