const fs = require('fs');

const isItAFile = (absolutePath = '') => {
  const doesItExist = fs.existsSync(absolutePath);
  if (!doesItExist) {
    return false;
  }
  return fs.lstatSync(absolutePath).isFile();
}

module.exports = isItAFile;
