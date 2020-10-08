const staticConfig = require('../static-study/config.js');

const config = {
  "readOnly": true,
  "format": false,
  "reset": false,
  "save": false
};

module.exports = Object.assign({}, staticConfig, config);
