'use strict';

const marked = require('marked')
const defaults = require('config').LENSES
const path = require('path')
const fs = require('fs')
const util = require('util')
const readFilePromise = util.promisify(fs.readFile)


const tableOfContents = (dirElement, first = false) => {

  if (dirElement.type === 'file') {
    const query = defaults[dirElement.ext] ? defaults[dirElement.ext] : '';
    return `<li><a href="${dirElement.toCwd}/${dirElement.dir}/${dirElement.base}?${query}">${dirElement.base}</a></li>\n`;
  }

  if (dirElement.type === 'directory') {
    const subIndex = Array.isArray(dirElement.children)
      ? dirElement.children.map(child => tableOfContents(child)).join('\n')
      : '';
    const query = defaults['directory'] ? defaults['directory'] : '';
    return first ? subIndex
      : (`<li><details><summary><a href="${dirElement.toCwd}/${dirElement.dir}/${dirElement.base}?${query}">${dirElement.base}</a></summary>\n`
        + (subIndex ? '\n<ul>' + subIndex + '</ul>' : '')
        + '</details></li>');
  }

  return '';
};

module.exports = async function renderTocDoc(virDir, config) {

  const readme = virDir.children
    .find(child => child.base.toLowerCase() === 'readme.md')

  const readmeSource = readme
    ? (await readFilePromise(path.join(readme.root, readme.dir, readme.base), 'utf-8'))
    : ''

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${virDir.path}</title>
    <link rel="icon" href="data:;base64,iVBORw0KGgo=">
    <style>
      ul {
        list-style-type: none;
      }
    </style>
    <link rel="stylesheet" href="${config.sharedStatic}/gh-styles.css">
    <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">
  </head>
  <body>
    <ul list-style='none'>
      <li><a href='./?${defaults.directory}'>..</a></li>
      ${tableOfContents(virDir, true)}
    </ul>

    <hr>
    <hr>

    <main class="markdown-body">${marked(readmeSource)}</main>
    <script src="${config.sharedStatic}/prism/script.js"></script>
  </body>
</html>`;
};

