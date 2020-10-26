const fs = require('fs');

const isItADirectory = (absolutePath = '') => {
  const doesItExist = fs.existsSync(absolutePath);
  if (!doesItExist) {
    return false;
  }
  return fs.lstatSync(absolutePath).isDirectory();
}

module.exports = isItADirectory;
