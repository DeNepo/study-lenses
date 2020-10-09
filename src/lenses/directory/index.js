const fs = require('fs');
const path = require('path');

const renderTocDoc = require('./render-toc-doc.js');
const renderPath = require('local-modules').renderPath;

const directoryLense = async (simpReq, resource, config) => {
  const { absPath } = resource;

  const requestedADirectory = fs.existsSync(absPath) && fs.lstatSync(absPath).isDirectory();

  const toRender = !requestedADirectory
    ? (await renderPath(path.dirname(absPath))).content
    : resource.content;

  resource.content = renderTocDoc(JSON.parse(toRender));
  resource.mime = 'text/html';

  return resource;
};

module.exports = directoryLense;
