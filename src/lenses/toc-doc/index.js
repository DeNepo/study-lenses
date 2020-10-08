const fs = require('fs');
const path = require('path');

const renderPath = require('local-modules/render-path');
const renderTocDoc = require('./render-toc-doc.js');

const tocDocLense = async (req, res, config) => {
  let absPath = config.absPath;

  const pathExists = fs.existsSync(absPath);
  const requestedADirectory = pathExists && fs.lstatSync(absPath).isDirectory();

  if (!requestedADirectory) {
    absPath = path.dirname(absPath);
  };

  const renderedPath = await renderPath(config);

  const virDir = renderedPath.content;
  const content = renderTocDoc(JSON.parse(virDir));
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(content, 'utf-8');

  return {
    req,
    res
  }
};

module.exports = tocDocLense;
