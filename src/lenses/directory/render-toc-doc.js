'use strict';

const pathModule = require('path');
const defaults = require('config').LENSES;

const tableOfContents = (dirElement, first = false) => {


  if (dirElement.type === 'file') {
    const ext = pathModule.extname(dirElement.path);
    const query = defaults[ext] ? `?${defaults[ext]}` : '';
    return `<li><a href="/${dirElement.path}${query}">${dirElement.name}</a></li>\n`;
  }

  if (dirElement.type === 'directory') {
    const subIndex = Array.isArray(dirElement.children)
      ? dirElement.children.map(child => tableOfContents(child)).join('\n')
      : '';
    return first ? subIndex
      : (`<li><details><summary><a href="/${dirElement.path}?${defaults.directory}">${dirElement.name}</a></summary>\n`
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
      <li><a href='./'>..</a></li>
      ${tableOfContents(virDir, true)}
    </ul>

  </body>
</html>`;
};

