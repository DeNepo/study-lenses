/* UPDATE

  using embedded study configs
  make sure links of all depths have correct local-configured lenses

*/


'use strict';

const marked = require('marked')
const path = require('path')
const fs = require('fs')
const util = require('util');
const readFilePromise = util.promisify(fs.readFile)


const tableOfContents = ({ dirElement, top = false, defaults = {} }) => {

  if (dirElement.type === 'file') {
    const query = defaults[dirElement.ext] ? '?' + defaults[dirElement.ext] : '';
    const relativePath = path.join(dirElement.toCwd, dirElement.dir, dirElement.base)
    return `<li><a href="${relativePath}${query}" target="_blank">${dirElement.base}</a></li>\n`;
  }

  if (dirElement.type === 'directory') {
    const subIndex = Array.isArray(dirElement.children)
      ? dirElement.children.map(child => tableOfContents({
        dirElement: child,
        defaults: Object.assign({}, defaults, dirElement.locals['--defaults'] || {})
      })).join('\n')
      : '';
    const query = defaults.directory ? defaults.directory : '';
    const relativePath = path.join(dirElement.toCwd, dirElement.dir, dirElement.base)
    return top ? subIndex
      : (`<li><details><summary>${dirElement.base}</summary>\n`
        + (subIndex ? '\n<ul style="list-style-type: none;">' + subIndex + '</ul>' : '')
        + '</details></li>');
    // return top ? subIndex
    //   : (`<li><details><summary><a href="${relativePath}?${query}">${dirElement.base}</a></summary>\n`
    //     + (subIndex ? '\n<ul>' + subIndex + '</ul>' : '')
    //     + '</details></li>');
  }

  return '';
};

module.exports = async function renderTocDoc({ virDir, config, top }) {

  const readme = virDir.children
    .find(child => child.base.toLowerCase() === 'readme.md')

  const readmeSource = readme
    ? (await readFilePromise(path.join(readme.root, readme.dir, readme.base), 'utf-8'))
    : ''

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${virDir.base}</title>
    <link rel="icon" href="data:;base64,iVBORw0KGgo=">
    <link rel="stylesheet" href="${config.sharedStatic}/gh-styles.css">
    <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">
  </head>
  <body>
    <a href='?--help' target='_blank'><code>--help</code>!  how does this work?</a>
    <hr>

    <ul style="list-style-type: none;">
      ${top ? '' : `<li><a href='./${virDir.locals['--defaults'] && '?' + virDir.locals['--defaults'].directory || ''}'>..</a></li>`}
      ${tableOfContents({ dirElement: virDir, top: true, defaults: virDir.locals['--defaults'] || {} })}
    </ul>

    <hr>
    <hr>

    <main class="markdown-body">${marked(readmeSource)}</main>
    <script src="${config.sharedStatic}/prism/script.js"></script>
  </body>
</html>`;
};

