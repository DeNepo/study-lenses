const detectType = (resource) => {

  if (!resource.info) {
    return 'code';
  }

  if (resource.info.base.includes('.p5.js')) {
    return 'p5';
  }
  else
    if (resource.info.ext === '.js') {
      return 'javascript';
    }
    // else if (resource.info.ext === '.md') {
    //   return 'markdown';
    // }
    else if (resource.info.ext === '.html') {
      return 'html';
    }
    else if (resource.type === 'directory') {
      return 'directory';
    }
    else {
      return 'code';
    };

};

module.exports = detectType;
