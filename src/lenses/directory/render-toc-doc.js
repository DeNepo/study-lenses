'use strict';

const pathModule = require('path');
const defaults = require('./default-lenses.js');

const tableOfContents = (dirElement, indent = '', first = false) => {

  if (dirElement.type === 'file') {
    const ext = pathModule.extname(dirElement.path);
    const query = defaults[ext] ? `?${defaults[ext]}` : '';
    return `${indent}<li><a href="./${dirElement.path}${query}">${dirElement.path.split('/').pop()}</a></li>\n`;
  }

  if (dirElement.type === 'directory') {
    const subIndex = Array.isArray(dirElement.children)
      ? dirElement.children.map(child => tableOfContents(child, indent + '  ')).join('\n')
      : '';
    return first ? subIndex
      : (`${indent}<li><details><summary><a href="./${dirElement.path}?directory">${dirElement.path.split('/').pop()}</a></summary>\n`
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
      ${tableOfContents(virDir, '', true)}
    </ul>

  </body>
</html>`;
};

