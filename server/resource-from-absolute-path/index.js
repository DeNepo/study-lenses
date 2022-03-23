'use strict';

const fs = require('fs');
const util = require('util');

const readFilePromise = util.promisify(fs.readFile);

const renderVirtualDirectory = require('./render-virtual-directory/index.js');
const getInfo = require('./get-info.js');

// rendered paths are inspired by path.parse, with with some (compatible?) modifications
//  see ./example-return-values.js for some example return values
const renderPath = async ({
  absolutePath = '',
  cwd = process.cwd(),
  localConfigs = {},
}) => {
  let info = null;
  let content = null;
  let error = null;

  const pathExists = fs.existsSync(absolutePath);
  if (!pathExists) {
    return {
      info,
      content,
      path: absolutePath,
      error,
    };
  }

  try {
    const requestedADirectory = fs.lstatSync(absolutePath).isDirectory();
    if (requestedADirectory) {
      content = await renderVirtualDirectory({
        absolutePath: absolutePath,
        studyConfig: localConfigs,
      });

      info = getInfo(absolutePath, cwd);
      info.ext = '.json';
    } else if (pathExists) {
      content = await readFilePromise(absolutePath, 'utf-8');
      info = getInfo(absolutePath, cwd);
    }
  } catch (err) {
    error = err;
  }

  return {
    info,
    content,
    path: absolutePath,
    error,
  };
};

module.exports = renderPath;
