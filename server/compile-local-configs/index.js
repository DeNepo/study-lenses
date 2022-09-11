'use strict';

const path = require('path');
const fs = require('fs');

const util = require('util');

const deepMerge = require('deepmerge');
const combineMerge = (target, source, options) => {
  const destination = target.slice();

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
    } else if (options.isMergeableObject(item)) {
      const alreadyExists = destination.some((entry) =>
        util.isDeepStrictEqual(entry, item),
      );
      if (!alreadyExists) {
        destination.push(item);
      } else {
        destination[index] = deepMerge(target[index], item, options);
      }
    } else if (target.indexOf(item) === -1) {
      destination.push(item);
    }
  });
  return destination;
};

const compileLocalConfigs = (absPath, config) => {
  const pastTheTop = !absPath.startsWith(process.cwd());
  if (pastTheTop) {
    // console.log('past the top')
    return config;
  }

  const pathExists = fs.existsSync(absPath);
  if (!pathExists) {
    // console.log('path does not exist')
    return config;
  }

  const isFile = fs.lstatSync(absPath).isFile();
  if (isFile) {
    // console.log('path is a file')
    return compileLocalConfigs(path.dirname(absPath), config);
  }

  const studyConfigPath = path.normalize(path.join(absPath, 'study.json'));
  const lensesConfigPath = path.normalize(path.join(absPath, 'lenses.json'));
  const hasLensesConfig = fs.existsSync(lensesConfigPath);
  const hasConfig = hasLensesConfig || fs.existsSync(studyConfigPath);

  if (!hasConfig) {
    // console.log('no config here')
    return compileLocalConfigs(path.dirname(absPath), config);
  }

  let currentConfig = {};
  try {
    currentConfig = JSON.parse(
      fs.readFileSync(
        hasLensesConfig ? lensesConfigPath : studyConfigPath,
        'utf-8',
      ),
    );
  } catch (err) {
    console.error(err);
  }

  // console.log('--- ', absPath)
  // console.log('currentConfig:', currentConfig)
  // console.log('config:', config)
  const newConfig = deepMerge(currentConfig, config, {
    arrayMerge: combineMerge,
  });
  // console.log('newConfig:', newConfig)

  const oneUp = path.dirname(absPath);
  return compileLocalConfigs(oneUp, newConfig);
};

module.exports = compileLocalConfigs;
