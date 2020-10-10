const fs = require('fs');
const path = require('path');

const renderTocDoc = require('./render-toc-doc.js');
const renderPath = require('local-modules').renderPath;

const directoryLense = async (simpReq, resource, config) => {
  const { absPath, relPath } = resource;

  const requestedADirectory = fs.existsSync(absPath) && fs.lstatSync(absPath).isDirectory();

  const toRender = !requestedADirectory
    ? (await renderPath(path.dirname(absPath))).content
    : resource.content;

  const virDir = JSON.parse(toRender);
  console.log(relPath)
  resource.content = renderTocDoc(virDir);
  resource.mime = 'text/html';

  return resource;
};

module.exports = directoryLense;
