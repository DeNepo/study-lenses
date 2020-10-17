'use strict'


const path = require('path');
const fs = require('fs');

const assert = require('assert')
const areDeeplyEqual = (actual, expected) => {
  try {
    assert.deepStrictEqual(actual, expected)
    return true
  } catch (o_0) {
    return false
  }
}

const deepMerge = require('deepmerge');
const combineMerge = (target, source, options) => {
  const destination = target.slice()

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
    } else if (options.isMergeableObject(item)) {
      const alreadyExists = destination.some(entry => areDeeplyEqual(entry, item))
      if (!alreadyExists) {
        destination.push(item)
      } else {
        destination[index] = deepMerge(target[index], item, options)
      }
    } else if (target.indexOf(item) === -1) {
      destination.push(item)
    }
  })
  return destination
}

const compileLocalConfigs = (absPath, cwd, config) => {


  const isFile = fs.existsSync(absPath) && fs.lstatSync(absPath).isFile();
  if (isFile) {
    return compileLocalConfigs(path.dirname(absPath), cwd, config);
  };

  const atOrPastTheTop = !absPath.match(cwd);

  const configPath = path.join(absPath, 'study.json');
  const hasConfig = fs.existsSync(configPath);

  if (atOrPastTheTop && !hasConfig) {
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

  const newConfig = deepMerge(currentConfig, config, { arrayMerge: combineMerge });

  if (atOrPastTheTop) {
    return newConfig;
  } else {
    const oneUp = path.dirname(absPath);
    return compileLocalConfigs(oneUp, cwd, newConfig);
  }


};

module.exports = compileLocalConfigs;
