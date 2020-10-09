'use strict';

const path = require('path');
const fs = require('fs');
const util = require('util');

const renderVirtualDirectory = require('./render-virtual-directory.js');
const mimes = require('./mime.js');
const readFilePromise = util.promisify(fs.readFile);

const renderPath = async (config) => {
  const { relPath, absPath } = config;

  const pathExists = fs.existsSync(absPath);
  const requestedADirectory = pathExists && fs.lstatSync(absPath).isDirectory();

  let content = '';
  let status = 0;
  let error = null;
  let mime = {};
  try {
    if (requestedADirectory) {
      const virDir = renderVirtualDirectory(path.relative(process.cwd(), absPath));
      content = JSON.stringify(virDir, null, '  ');
      mime = mimes['html'];
      status = 200
    } else if (pathExists) {
      content = await readFilePromise(absPath, 'utf-8');
      mime = mimes[path.extname(absPath)];
      status = 200
    } else {
      content = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>404</title></head><body><h1>404: ${relPath}</h1></body></html>`;
      mime = mimes['html'];
      status = 404;
    }
  } catch (err) {
    console.log(err)
    error = err;
  }

  return {
    content,
    mime,
    status,
    error
  };

}

module.exports = renderPath
