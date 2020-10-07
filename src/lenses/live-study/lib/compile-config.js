const path = require('path');
const fs = require('fs');

const compileConfig = (absPath, config = {}) => {

  const isFile = fs.existsSync(absPath) && fs.lstatSync(absPath).isFile();
  if (isFile) {
    return compileConfig(path.dirname(absPath));
  };

  const configPath = path.join(absPath, 'live-study.json');
  const hasConfig = fs.existsSync(configPath);

  if (absPath === process.cwd() && !hasConfig) {
    return config;
  }

  let currentConfig = {};
  if (hasConfig) {
    try {
      currentConfig = require(configPath);
    } catch (err) {
      console.log(err);
    };
  };

  const newConfig = Object.assign({}, currentConfig, config);

  const atTheTop = absPath === process.cwd();
  if (atTheTop) {
    return newConfig;
  } else {
    const oneUp = path.dirname(absPath);
    return compileConfig(oneUp, newConfig);
  }


};

module.exports = compileConfig;
