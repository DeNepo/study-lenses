"use strict";

const fs = require("fs");
const path = require("path");

// const util = require("util");
// const readFilePromise = util.promisify(fs.readFile);

const dirLinks = require("./dir-links");

const renderDir = (resource, config) => {
  let readmeSection = "";
  const readmePath = path.join(
    resource.info.root,
    resource.info.dir,
    resource.info.base,
    "README.md"
  );
  if (fs.existsSync(readmePath)) {
    readmeSection = `<hr><iframe src="${path.join(
      resource.info.base,
      "README.md"
    )}?study" style='height: 100vh; width: 100vw;' frameBorder="0"></iframe>`;
  }

  return `
<!DOCTYPE html>
  <html>
  <head>
    <link rel="stylesheet" href="${config.sharedStatic}/gh-styles.css">
  </head>
  <body>
    <div class="markdown-body">
      <ul style="list-style-type: none;">
        ${dirLinks({
          dirElement: resource.content,
          top: true,
          defaults: config,
        })}
      </ul>
      ${readmeSection}
    </div>

  </body>
</html>`;
};

module.exports = renderDir;
