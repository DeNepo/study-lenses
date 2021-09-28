"use strict";

const path = require("path");
const fs = require("fs");

const searchableExtensions = [
  ".js",
  ".txt",
  ".css",
  ".md",
  ".html",
  ".json",
  ".yml",
];

const searchFilterRegex = (resource = {}, search = new RegExp("", "")) => {
  if (resource.type === "file") {
    if (!searchableExtensions.includes(resource.ext)) {
      return null;
    }

    const filePath = path.join(resource.root, resource.dir, resource.base);
    // console.log(filePath);
    const contents = fs.readFileSync(filePath, "utf8");
    // console.log(contents);
    const tested = search.test(contents);
    // console.log(search, tested);
    const result = tested ? resource : null;
    // console.log(result);
    return result;
  } else {
    const mapped = resource.children.map((item) =>
      searchFilterRegex(item, search)
    );
    // console.log("mapped - ", mapped);
    const filtered = mapped.filter(
      (item) =>
        (item !== null && item.type === "file") ||
        (item && item.type === "directory" && item.children.length !== 0)
    );
    // console.log("filtered - ", filtered);
    resource.children = filtered;
    return resource;
  }
};

const searchFilterIncludes = (resource = {}, search = new RegExp("", "")) => {
  if (resource.type === "file") {
    if (!searchableExtensions.includes(resource.ext)) {
      return null;
    }

    const filePath = path.join(resource.root, resource.dir, resource.base);
    // console.log(filePath);
    const contents = fs.readFileSync(filePath, "utf8");
    // console.log(contents);
    const searched = contents.includes(search);
    // console.log(search, tested);
    const result = searched ? resource : null;
    // console.log(result);
    return result;
  } else {
    const mapped = resource.children.map((item) =>
      searchFilterIncludes(item, search)
    );
    // console.log("mapped - ", mapped);
    const filtered = mapped.filter(
      (item) =>
        (item !== null && item.type === "file") ||
        (item && item.type === "directory" && item.children.length !== 0)
    );
    // console.log("filtered - ", filtered);
    resource.children = filtered;
    return resource;
  }
};

module.exports = {
  searchFilterRegex,
  searchFilterIncludes,
};
