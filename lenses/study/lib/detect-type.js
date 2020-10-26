const detectType = (resource) => {

  if (!resource.info) {
    return 'code';
  }

  // to support  .re.p5.js and .p5.re.js
  if (resource.info.base.includes('.p5.') && resource.info.ext === '.js') {
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
