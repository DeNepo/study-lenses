"use strict";

const path = require("path");

const prettier = require("prettier");

// map from file extensions to possible md fence names
// this is used in the regex to extract all language code blocks
// regex is case insensitive
const extensionMap = {
  ".md": {
    comment: (text) => `<!-- ${text} -->`,
    fenceNames: ["markdown", "md"],
  },
  ".js": {
    comment: (text) => `/* ${text} */`,
    fenceNames: ["javascript", "js"],
  },
  ".ts": {
    comment: (text) => `/* ${text} */`,
    fenceNames: ["typescript", "ts"],
  },
  ".py": {
    comment: (text) => `''' ${text} '''`,
    fenceNames: ["python", "py"],
  },
  ".css": {
    comment: (text) => `/* ${text} */`,
    fenceNames: ["css"],
  },
  ".html": {
    comment: (text) => `<!-- ${text} -->`,
    fenceNames: ["html"],
  },
  ".json": {
    comment: (_) => ``,
    fenceNames: ["json"],
  },
  ".jsx": {
    comment: (text) => `{/* ${text} */}`,
    fenceNames: ["jsx"],
  },
};

/**
 * extracts the code blocks from a literate markdown file
 * @param {string} [fileName=''] - the basename for a file path
 * @param {string} [content=''] - the contents of that file path
 * @param {boolean} [commentSections=true] - whether to inject a comment to demark code blocks in the file
 * @returns {object} - {
 *  fileName: '', // the new file name, unchanged if not literate, or with the .md removed
 *  content: '', // the new file content, unchanged if not literate, or with code extracted
 * }
 */
const simplit = (fileName = "", content = "", commentSections = true) => {
  const isMarkdownFile = path.extname(fileName) === ".md";
  if (!isMarkdownFile) {
    return { fileName, content };
  }

  const numberOfDotsInFileName = fileName.replace(/[^.]/g, "").length;
  const isLiterateFileName = numberOfDotsInFileName > 1;
  if (!isLiterateFileName) {
    return { fileName, content };
  }

  fileName = path.basename(fileName.replace(path.extname(fileName), ""));
  const extName = path.extname(fileName);

  const chunkSeparator = !commentSections
    ? (_) => "\n\n"
    : (text) => `\n\n\n${extensionMap[extName].comment(text)}\n\n`;

  const fenceNames = extensionMap[extName].fenceNames;
  // refactor: https://github.com/regexhq/gfm-code-block-regex/blob/master/index.js
  const regex = new RegExp(
    "```(?:" + fenceNames.join("|") + ")(?<code>[\\s\\S]*?)(?:```)",
    "gim"
  );
  const matches = content.matchAll(regex);

  const codeFences = [];
  for (const match of matches) {
    if (match.groups.code) {
      codeFences.push(match.groups.code);
    }
  }

  let extractedCode = "";
  for (let i = 0; i < codeFences.length; i++) {
    const fenceCode = codeFences[i];
    const separator = chunkSeparator("chunk " + (i + 1));
    extractedCode += separator + fenceCode;
  }

  let formatted = extractedCode;
  try {
    formatted =
      extName === ".js" || extName === ".ts"
        ? prettier.format(extractedCode, { parser: "babel-ts" })
        : extName === ".html"
        ? prettier.format(extractedCode, { parser: "html" })
        : extName === ".css"
        ? prettier.format(extractedCode, { parser: "css" })
        : extName === ".json"
        ? prettier.format(extractedCode, { parser: "json" })
        : extractedCode;
  } catch (er) {
    console.log(err);
  }

  return {
    fileName,
    content: formatted,
  };
};

module.exports = simplit;
