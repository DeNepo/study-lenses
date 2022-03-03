"use strict";

const fs = require("fs");
const path = require("path");
const util = require("util");
const readFilePromise = util.promisify(fs.readFile);

const getInfo = require("../get-info.js");
const isItAFile = require("../../lib/is-it-a-file");
const isItADirectory = require("../../lib/is-it-a-directory");
const deepSortChildren = require("./deep-sort-children.js");

const deepMerge = require("deepmerge");
const combineMerge = (target, source, options) => {
  const destination = target.slice();

  source.forEach((item, index) => {
    if (typeof destination[index] === "undefined") {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
    } else if (options.isMergeableObject(item)) {
      const alreadyExists = destination.some((entry) =>
        util.isDeepStrictEqual(entry, item)
      );
      if (!alreadyExists) {
        destination.push(item);
      } else {
        destination[index] = deepMerge(target[index], item, options);
      }
    } else if (target.indexOf(item) === -1) {
      destination.push(item);
    }
  });
  return destination;
};

const renderVirtualDirectory = async ({
  absolutePath,
  gitignore = [],
  studyConfig = {},
}) => {
  const toCwd = path.relative(absolutePath, process.cwd());

  if (isItAFile(absolutePath)) {
    return getInfo(absolutePath, process.cwd());
  }

  if (!isItADirectory(absolutePath)) {
    return getInfo(absolutePath, process.cwd());
  }

  const paths = fs.readdirSync(absolutePath);

  if (paths.includes("study.json")) {
    // const thisConfig = fs.readFileSync(path.join(absolutePath, 'study.json'), 'utf-8')
    try {
      const thisConfig = await readFilePromise(
        path.join(absolutePath, "study.json"),
        "utf-8"
      );
      const parsedConfig = JSON.parse(thisConfig);
      studyConfig = deepMerge(studyConfig, parsedConfig, {
        arrayMerge: combineMerge,
      });
    } catch (o_0) {
      // console.error(o_0);
    }
  }

  const virDir = getInfo(absolutePath, process.cwd());
  virDir.toCwd = toCwd;
  virDir.locals = studyConfig;
  virDir.children = [];

  if (paths.includes(".gitignore")) {
    gitignore = [];
    const toIgnore = fs.readFileSync(
      path.join(absolutePath, ".gitignore"),
      "utf-8"
    );
    toIgnore.split("\n").forEach((ignorable) => {
      gitignore.push(ignorable);
    });
  }

  let subPathPromises = [];
  for (let nextSubPath of paths) {
    if (
      nextSubPath[0] === "." &&
      !(nextSubPath.startsWith(".study") || nextSubPath.startsWith(".lens"))
    ) {
      continue;
    }
    // quick fix to avoid node_modules, full gitignore later
    if (nextSubPath.match("node_modules")) {
      continue;
    }

    const nextAbsolutePath = path.join(absolutePath, nextSubPath);
    if (!fs.existsSync(nextAbsolutePath)) {
      continue;
    }

    subPathPromises.push(
      renderVirtualDirectory({
        absolutePath: nextAbsolutePath,
        gitignore,
        studyConfig,
      })
    );
  }

  virDir.children.push(...(await Promise.all(subPathPromises)));

  deepSortChildren(virDir);

  return virDir;
};

module.exports = renderVirtualDirectory;
