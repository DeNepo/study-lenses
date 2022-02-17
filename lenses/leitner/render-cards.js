"use strict";

const fs = require("fs");
const path = require("path");
const util = require("util");
const readFilePromise = util.promisify(fs.readFile);

const marked = require("marked");
const prettier = require("prettier");

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

  <h2>${resource.info.base}</h2>
  <div>
    This page will help you study your flashcards using the <a target="_blank" href="https://www.youtube.com/watch?v=6S2LJIAydyg">Leitner system</a>.

    <br>

    Here's the main idea: study cards from box 1 every day, study cards from box 2 every other day, ...

    <ul>
      <li>Move a card to the next box if you guess it correctly before flipping it.</li>
      <li>Move a card to box 1 if you get it wrong, no matter which box it was in.</li>
    </ul>

    To learn about how you can create more flashcards check out <a href="./?--help=leitner" target="blank">?--help=leitner</a>.
  </div>

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
          prettier.format(
            await readFilePromise(
              path.join(
                resource.info.root,
                resource.info.dir,
                resource.info.base,
                "README.md"
              ),
              "utf-8"
            ),
            { parser: "markdown", proseWrap: "always" }
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
