"use strict";

const p5lense = async ({ resource, config }) => {
  if (!resource.info && !config.queryValue.code) {
    return;
  }
  // console.log(resource);

  let code = resource.content;
  let ext = resource.info.ext;

  if (typeof config.queryValue.code === "string") {
    code = config.queryValue.code;
    ext = config.queryValue.ext || resource.info.ext;
  } else if (typeof resource.content !== "string") {
    return;
  }

  if (ext !== ".js") {
    return;
  }

  if (!code) {
    return;
  }

  let start = 0;
  let end = code.split("\n").length;

  if (typeof config.queryValue.start === "number") {
    start = config.queryValue.start;
  }

  if (typeof config.queryValue.end === "number") {
    end = config.queryValue.end;
  }

  code = code
    .split("\n")
    .slice(start, end + 1)
    .join("\n");

  resource.content = `
<!DOCTYPE html>
  <html>
  <head>
    <script src="${config.sharedStatic}/p5.min.js"></script>
    <script src="${config.sharedStatic}/p5.sound.min.js"></script>
    <script> function setup() { } </script>

    <script>const code = decodeURI("${encodeURI(code)}");</script>

  </head>
  <body>
    <br>
    <button id='restart-button'>restart</button>
    <button id='debug-button'>debug</button>
    | <input id='loop-checkbox' type='checkbox' checked /> loop
    <hr>

    <script src="${config.ownStatic}/index.js"></script>
  </body>
</html>`;
  resource.info.ext = ".html";

  return {
    resource,
  };
};

module.exports = p5lense;
