'use strict';

const path = require('path');
const fs = require('fs');
const util = require('util');
const readFilePromise = util.promisify(fs.readFile);

const renderAppendices = async (appendices) => {
  console.log(appendices)
  if (!Array.isArray(appendices)) {
    return ''
  }

  let renderedAppendices = '';
  for (const appendicy of appendices) {

    const normalizedPath = path.normalize(path.join(process.cwd(), appendicy))
    try {
      renderedAppendices += await readFilePromise(normalizedPath);
    } catch (err) {
      console.error(err);
    }

  }

  return '\n\n// appended appendices \n\n' + renderedAppendices;
};

module.exports = renderAppendices;
