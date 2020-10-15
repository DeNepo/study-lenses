'use strict';

const path = require('path')

const defaults = require('./default-lenses.js');

const tableOfContents = (dirElement, first = false) => {

  if (dirElement.type === 'file') {
    const query = defaults[dirElement.ext] ? `?${defaults[dirElement.ext]}` : '';
    return `<li><a href="${dirElement.toCwd}/${dirElement.dir}/${dirElement.base}${query}">${dirElement.base}</a></li>\n`;
  }

  if (dirElement.type === 'directory') {
    const subIndex = Array.isArray(dirElement.children)
      ? dirElement.children.map(child => tableOfContents(child)).join('\n')
      : '';
    return first ? subIndex
      : (`<li><details><summary><a href="${dirElement.toCwd}/${dirElement.dir}/${dirElement.base}?${defaults.directory}">${dirElement.base}</a></summary>\n`
        + (subIndex ? '\n<ul>' + subIndex + '</ul>' : '')
        + '</details></li>');
  }

  return '';
};

module.exports = function renderTocDoc(virDir) {
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
  </head>
  <body>
    <ul list-style='none'>
      <li><a href='./?${defaults.directory}'>..</a></li>
      ${tableOfContents(virDir, true)}
    </ul>

    <script>
      console.log(${JSON.stringify(virDir)})
    </script>

  </body>
</html>`;
};

