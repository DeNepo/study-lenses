"use strict";

const videoLens = ({ resource }) => {
  if (
    !resource.info &&
    !(
      resource.info.ext === ".mp4" ||
      resource.info.ext === ".ogg" ||
      resource.info.ext === ".mov" ||
      resource.info.ext === ".webm"
    )
  ) {
    return;
  }

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
    <video controls style="height: 100%; width: 100%;" src="./${resource.info.base}?--ignore" ></video>
  </body>
</html>`;

  return { resource };
};

module.exports = videoLens;
