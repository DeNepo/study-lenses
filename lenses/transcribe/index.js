"use strict";

const transcribeLens = ({ resource, config }) => {
  // audio types supported by <audio>
  if (
    !resource.info &&
    !(
      resource.info.ext.toLowerCase() === ".mp3" ||
      resource.info.ext.toLowerCase() === ".ogg" ||
      resource.info.ext.toLowerCase() === ".wav"
    )
  ) {
    return;
  }

  console.log(config);

  const audioType = resource.info.ext.replace(".", "");

  resource.info.ext = ".html";
  resource.content = `
<!DOCTYPE html>
  <html>
  <head>
    <style>
      .fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        overflow: auto;
      }
    </style>
  </head>
  <body class="fullscreen">
    <audio controls src="./${resource.info.base}?--ignore" type="audio/${audioType}">
    Your browser does not support the audio element.
    </audio>
  </body>
</html>`;

  return { resource };
};

module.exports = transcribeLens;
