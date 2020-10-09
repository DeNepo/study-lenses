const path = require('path');
const fs = require('fs');

const renderPath = require('local-modules').renderPath;

const simplit = require('./simplit.js');

const tocDocLense = require('../toc-doc/index.js');

const simplitLense = async (req, res, config) => {
  const absPath = config.absPath;

  const pathExists = fs.existsSync(absPath);
  const requestedADirectory = pathExists && fs.lstatSync(absPath).isDirectory();
  if (requestedADirectory) {
    return tocDocLense(req, res, config);
  }

  const isSimplit = pathExists && fs.existsSync(absPath + '.md');


  const correctedPath = isSimplit ? absPath + '.md' : absPath;

  const rendered = await renderPath({ absPath: correctedPath, relPath });

  const content = isSimplit ? simplit(absPath, rendered.content) : rendered.content;

  res.writeHead(200, { 'Content-Type': rendered.mime.type });
  res.write(content, 'utf-8');

  return {
    req,
    res
  }
};

module.exports = simplitLense;
