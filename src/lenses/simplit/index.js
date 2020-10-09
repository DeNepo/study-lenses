const fs = require('fs');

const path = require('path');

const mimes = require('local-modules').mime;

const simplit = require('./simplit.js');

const simplitLense = async (simpReq, resource, config) => {
  const { absPath, relPath } = resource;

  const requestedADirectory = fs.existsSync(absPath) && fs.lstatSync(absPath).isDirectory();
  if (requestedADirectory) {
    return resource;
  }

  const extName = path.extname(absPath);
  if (extName !== '.md') {
    // only .md files can be simplit
    return resource;
  }

  const embeddedPath = absPath.replace(new RegExp('.md$'), '');
  const embeddedExtension = path.extname(embeddedPath);
  if (embeddedExtension === '') {
    // it is not a simplit file
    return resource;
  }

  resource.content = simplit(absPath, resource.content);
  resource.mime = mimes[embeddedExtension];
  resource.absPath = absPath.replace(new RegExp('.md$'), '');
  resource.relPath = relPath.replace(new RegExp('.md$'), '');

  return resource
};

module.exports = simplitLense;
