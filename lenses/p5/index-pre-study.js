"use strict";

const p5lens = async ({ resource, config }) => {
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
    <form id='controls'>
      <button id='restart-button'>restart</button>
      | <input id='loop' name='how' value='loop' type='radio' checked /> <label for='loop'>play</label>
      <input id='pause' name='how' value='pause' type='radio' /> <label for='pause'>pause</label>
      | <input id='step' name='how' value='step' type='radio' /> <label for='step'>step</label>
      <input id='delay-input' style='width: 7em;' type='range' />
      | <input id='slow' name='how' value='slow' type='radio' /> <label for='slow'>frame rate</label>
      <input id='slow-input' style='width: 7em;' type='range' />
    </form>
    <hr>

    <script src="${config.ownStatic}/index.js"></script>
  </body>
</html>`;
  resource.info.ext = ".html";

  return {
    resource,
  };
};

module.exports = p5lens;
