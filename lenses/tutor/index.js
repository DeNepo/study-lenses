"use strict";

const tutorLense = async ({ responseData, resource, config }) => {
  if (!resource.info && !config.queryValue.code) {
    return;
  }

  let code = resource.content;
  let ext = resource.info.ext;

  if (typeof config.queryValue.code === "string") {
    code = config.queryValue.code;
    ext = config.queryValue.ext || "";
  } else if (typeof resource.content !== "string") {
    return;
  }

  if (ext !== ".js") {
    return;
  }

  if (!code) {
    return;
  }

  const encodedCode = encodeURIComponent(code)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%09/g, "%20%20");
  const tutorIframe = `<iframe width="800" height="500" frameborder="0" src="http://pythontutor.com/iframe-embed.html#code=${encodedCode}&codeDivHeight=400&codeDivWidth=350&curInstr=0&origin=opt-frontend.js&py=js&rawInputLstJSON=%5B%5D"> </iframe>`;

  resource.content = `
<!DOCTYPE html>
  <html>
  <head></head>
  <body>
    ${tutorIframe}
  </body>
</html>`;
  resource.info.ext = ".html";

  return {
    resource,
  };
};

module.exports = tutorLense;
