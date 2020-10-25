'use strict';

// see ../load-plugin.js for where static paths are defined

const path = require('path');

const filePathFromRequestPath = (requestPath) => {

  let absolutePath = '';

  absolutePath = path.join(process.cwd(), requestPath);

  return absolutePath
};

module.exports = filePathFromRequestPath;
