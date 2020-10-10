// broken, not priority

const path = require('path');
const fs = require('fs');
const util = require('util');
const readFilePromise = util.promisify(fs.readFile);

const doccoNext = require('docco-next');

const doccoNextLense = async (req, res, config) => {


  // if (pathExists) {
  // const source = await readFilePromise(absPath, 'utf-8');
  const doccoed = doccoNext.documentOne(config.path);
  console.log(doccoed)
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(doccoed, 'utf-8');
  // } else {
  //   const html404 = `<!DOCTYPE html><html><head><title>404</title></head><body><h1>404: ${relPath}</h1></body></html>`;
  //   res.writeHead(404, { 'Content-Type': 'text/html' });
  //   res.write(html404, 'utf-8');
  // }

  return {
    req,
    res
  }
};

module.exports = doccoNextLense;
