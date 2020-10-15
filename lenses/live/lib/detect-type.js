const path = require('path');
const fs = require('fs');

const detectType = (absPath) => {

  if (absPath.includes('.p5.js')) {
    return 'p5';
  }
  else if (path.extname(absPath) === '.js') {
    return 'javascript';
  }
  else if (path.extname(absPath) === '.md') {
    return 'markdown';
  }
  else if (fs.existsSync(absPath) && fs.lstatSync(absPath).isDirectory()) {
    return 'directory';
  }
  else {
    return 'static';
  };

};

module.exports = detectType;
