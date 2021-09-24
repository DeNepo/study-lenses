"use strict";

const fs = require("fs");
const path = require("path");

const MarkdownSSR = require("../markdown/index.js");

const searchFilter = require("./search-filter");

let searchQuery = "";
let flags = "";

class DirectorySSR extends MarkdownSSR {
  constructor({ config, resource }) {
    searchQuery = config.queryValue.searchQuery || "";
    flags =
      typeof config.queryValue.flags === "string"
        ? config.queryValue.flags
        : "igm";

    if (
      typeof searchQuery === "string" &&
      searchQuery !== "" &&
      typeof flags === "string"
    ) {
      // console.log("------ ", searchQuery, flags);
      const searchRegex = new RegExp(searchQuery, flags);
      // console.log(resource.content);
      resource.content = searchFilter(resource.content, searchRegex);
      // console.log(JSON.stringify(resource.content, null, "  "));
    }

    // console.log(resource);
    let readmeContent = "";
    try {
      const readmePath = path.join(
        resource.info.root,
        resource.info.dir,
        resource.info.base,
        "README.md"
      );
      // console.log(readmePath);
      readmeContent = fs.readFileSync(readmePath, "utf-8");
      // console.log(content);
    } catch (o_0) {
      // console.error(o_0);
    }

    const dirRegex = /(<!--[ \t]*begin[ \t]*dir[ \t]*-->)([\s\S]*)(<!--[ \t]*end[ \t]*dir[ \t]*-->)/gim;
    if (!dirRegex.test(readmeContent)) {
      readmeContent =
        `<!-- BEGIN DIR --><!-- END DIR --> \n <hr> <hr> \n\n` + readmeContent;
    }

    super({ config, resource, content: readmeContent });
  }

  panel() {
    const superPanel = super.panel();

    const panel = `
    <hr>
    <form onsubmit="return false;">
      <input id="search-button" type="button" value="search (regex):" />
      <input name="search" id="search-input" style="width: 15em;" value="${
        searchQuery || ""
      }" />
      <input type="checkbox" ${
        flags && flags.includes("i") ? "checked" : ""
      } name="i" id="i" /><label for="i">i</label>
      <input type="checkbox" ${
        flags && flags.includes("g") ? "checked" : ""
      } name="g" id="g" /><label for="g">g</label>
      <input type="checkbox" ${
        flags && flags.includes("m") ? "checked" : ""
      } name="m" id="m" /><label for="m">m</label>
    </input>`;

    return panel + "\n\n" + superPanel;
  }
}

module.exports = DirectorySSR;
