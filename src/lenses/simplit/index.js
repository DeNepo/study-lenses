const path = require('path');
const fs = require('fs');

const renderPath = require('local-modules/render-path')

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

  const mockResponse = {
    source: '',
    writeHead() { },
    write(source) {
      this.source = source;
    }
  }
  await defaultLense(req, mockResponse, { absPath: correctedPath });

  const content = isSimplit ? simplit(absPath, mockResponse.source) : mockResponse.source;

  res.writeHead(200, { 'Content-Type': 'text/' + path.extname(absPath).split('.')[0] });
  res.write(content, 'utf-8');

  return {
    req,
    res,
    content
  }
};

module.exports = simplitLense;
