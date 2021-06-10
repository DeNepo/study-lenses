const detectType = (resource) => {
  if (!resource.info) {
    return "code";
  }

  // to support  .re.p5.js and .p5.re.js
  //  -- deprecating ?study support of p5 ?
  //    ?p5 lens takes over, that's cleaner
  //    ?study should be for languages
  if (
    resource.info.base &&
    resource.info.base.includes(".p5.") &&
    resource.info.ext === ".js"
  ) {
    return "p5";
  } else if (resource.info.ext === ".js") {
    return "javascript";
  } else if (resource.info.ext === ".md") {
    return "markdown";
  } else if (resource.info.ext === ".html") {
    return "html";
  } else if (resource.info.type === "directory") {
    return "directory";
  } else {
    return "code";
  }
};

module.exports = detectType;
