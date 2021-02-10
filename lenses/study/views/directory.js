"use strict";

const fs = require("fs");
const path = require("path");

const MarkdownSSR = require("./markdown/index.js");

class DirectorySSR extends MarkdownSSR {
  constructor({ config, resource }) {
    // console.log(resource);
    let content = "";
    try {
      const readmePath = path.join(
        resource.info.root,
        resource.info.dir,
        resource.info.base,
        "README.md"
      );
      // console.log(readmePath);
      content = fs.readFileSync(readmePath, "utf-8");
      // console.log(content);
    } catch (o_0) {
      console.error(o_0);
    }

    const dirRegex = /(<!--[ \t]*begin[ \t]*dir[ \t]*-->)([\s\S]*)(<!--[ \t]*end[ \t]*dir[ \t]*-->)/gim;
    if (!dirRegex.test(content)) {
      content =
        `<!-- BEGIN DIR --><!-- END DIR --> \n <hr> <hr> \n\n` + content;
    }

    super({ config, resource, content });
  }
}

module.exports = DirectorySSR;
