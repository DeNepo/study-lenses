#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const userArgs = process.argv.slice(2);

const pathToStudy = userArgs[0] || '';

const absPathToStudy = path.join(process.cwd(), pathToStudy);

const isValidPath = fs.existsSync(absPathToStudy);

if (!isValidPath) {
  throw new Error(pathToStudy + ': is not a valid path');
};

require('../src/server/index.js');
const config = require('config');

const extName = path.extname(pathToStudy);
const lenseName = fs.lstatSync(absPathToStudy).isDirectory()
  ? config.LENSES.directory
  : config.LENSES[extName] !== undefined
    ? config.LENSES[extName]
    : '';

const pathToOpen = path.normalize(pathToStudy);
const url = `http://localhost:${config.get('PORT')}/${pathToOpen}?${lenseName}`;
console.log('studying: ', url);

require('open')(url);
