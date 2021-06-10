"use strict";

const replLens = async ({ resource, config }) => {
  if (!resource.info || resource.content === undefined) {
    return;
  }

  if (resource.info.ext !== ".js") {
    return;
  }

  try {
    resource.content = `
<!DOCTYPE html>
  <html>
  <head></head>
  <body style="height: 95vh; width: 99vw;">
    <iframe
      allowfullscreen="allowfullscreen" webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen
      width="100%"
      height="100%"
      frameborder="0"
      src="${config.sharedStatic}/repl/index.html#data=${encodeURIComponent(
      JSON.stringify({ code: resource.content })
    )}"
    ></iframe>
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

module.exports = replLens;
