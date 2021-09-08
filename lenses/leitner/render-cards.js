"use strict";

const fs = require("fs");
const path = require("path");
const util = require("util");
const readFilePromise = util.promisify(fs.readFile);

const marked = require("marked");

const renderCards = async ({ config, resource, leitner }) => {
  resource.info.ext = ".html";
  resource.content = `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title id='title'>${
    config.title || `${resource.info.dir}/${resource.info.base}`
  }</title>
  <link rel="icon" href="data:;base64,iVBORw0KGgo=">
  <link rel="stylesheet" href="${config.sharedStatic}/gh-styles.css">

</head>

<body>

  <h2>Leitner box: ${resource.info.base}</h2>
  <p>
    study a flashcard from:
  </p>
  <div id='choose-card'>
    <ol id='boxes'></ol>
  </div>

  ${
    fs.existsSync(
      path.join(
        resource.info.root,
        resource.info.dir,
        resource.info.base,
        "README.md"
      )
    )
      ? `<hr> <main class="markdown-body"><div></div>${marked(
          await readFilePromise(
            path.join(
              resource.info.root,
              resource.info.dir,
              resource.info.base,
              "README.md"
            ),
            "utf-8"
          )
        )}</main>`
      : ""
  }

  <script>const leitner = JSON.parse(decodeURI("${encodeURI(
    JSON.stringify(leitner)
  )}"));</script>
  <script type='module' src='${config.ownStatic}/cards.js'></script>


</body>

</html>
`;
  return { resource };
};

module.exports = renderCards;
