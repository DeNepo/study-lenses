'use strict';

// see ../load-plugin.js for where static paths are defined

const path = require('path');

const filePathFromRequestPath = (requestPath) => {

  let absolutePath = '';
  if (requestPath.includes('shared_static_resources')) {
    const subPath = requestPath.split('shared_static_resources').pop()
    absolutePath = path.join(__dirname, '..', '..', '..', 'static', subPath)

  } else if (requestPath.includes('own_static_resources')) {
    const type = requestPath.split('__')[1]
    const name = requestPath.split('__')[2]
    const subPath = requestPath.split('__')[3]
    absolutePath = path.join(__dirname, '..', '..', '..', type, name, 'static', subPath)

  } else if (requestPath.includes('_public__example__files_')) {
    // used by the --help lense user guide
    const subPath = requestPath.split('_public__example__files_').pop()
    absolutePath = path.join(__dirname, '..', '..', '..', 'public-example-files', subPath)

  } else {
    absolutePath = path.join(process.cwd(), requestPath);
  };

  return absolutePath
};

module.exports = filePathFromRequestPath;
