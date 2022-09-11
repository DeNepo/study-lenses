/* UPDATE
  compile configs for each dir to know when to render dep graph
*/

'use strict';

const path = require('path');

const dirContents = (dirElement = {}, top = false) => {
  const locals = dirElement.locals;

  if (dirElement.type === 'file') {
    const isRe = dirElement.base.toLowerCase().includes('.re.');
    const relativePath = path.join(
      dirElement.toCwd,
      dirElement.dir,
      dirElement.base,
    );

    // obfuscate .js files, minify html and CSS
    // return `<li><a href="${relativePath}?${
    //   isRe && /.js$/i.test(dirElement.base) ? 'obf&min&' : isRe ? 'min&' : ''
    // }--defaults">${dirElement.base}</a></li>\n`;
    return `<li><a href="${relativePath}?${
      isRe && /.js$/i.test(dirElement.base) ? 'obf&min&' : isRe ? 'min&' : ''
    }--defaults" target="_blank">${dirElement.base}</a></li>\n`;
  }

  if (dirElement.type === 'directory') {
    const nameElement = dirElement.base;
    const subIndex = Array.isArray(dirElement.children)
      ? dirElement.children
          .filter((child) => {
            const isReJS = child && child.base.toLowerCase().includes('.re.js');
            if (!isReJS) {
              return true;
            }

            const childName = child.name.toLowerCase().replace('.re', '');
            const hasPair = dirElement.children.find((otherChild) => {
              return otherChild !== child && otherChild.name === childName;
            });

            return hasPair ? false : true;
          })
          .map((child) => {
            return dirContents(child);
          })
          .join('\n')
      : '';

    const relativePath = path.join(
      dirElement.toCwd,
      dirElement.dir,
      dirElement.base,
    );

    return top
      ? (locals && locals.study && locals.study.deps
          ? `<li><a href="./${relativePath}/?deps" target="_blank" style="font-style: italic; font-size: 0.8em;">dependency graph</a></li>`
          : '') + subIndex
      : `<li><details style="margin-bottom: 0px;"><summary><a href="${relativePath}?--defaults">${nameElement}</a></summary>\n` +
          (subIndex
            ? '\n<ul style="list-style-type: none;">' +
              (locals && locals.study && locals.study.deps
                ? `<li><a href="${
                    top ? './' : relativePath
                  }?deps" target="_blank" style="font-style: italic; font-size: 0.8em;">dependency graph</a></li>`
                : '') +
              subIndex +
              '</ul>'
            : '') +
          '</details></li>';
  }

  return '';
};

module.exports = dirContents;
