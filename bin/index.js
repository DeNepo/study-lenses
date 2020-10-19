#!/usr/bin/env node

/* this file is the entry point when launching `study` from the CLI */

const fs = require('fs');
const path = require('path');

process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '..', "config");

const config = require('config');

/* The user can optionally launch a sub-path from the directory they are in
  if they do this, localhost will still serve from the root of the directory
    the browser will just open to the selected sub-path
  when global configuration is set, there will be default plugin options for different mime types
    then the browser will open to that sub-path with the appropriate queries
    -> localhost:xxxx/user/defined/path?default-plugins-for-mime-type
*/
const userArgs = process.argv.slice(2);
const pathToStudy = userArgs[0] || '';

// todo
// search process.argv for "-h"
// log a little guide to the console

// subsequent arguments can be interpreted as plugins to apply, overriding the default
//  $ study ./path/file.js format highlight
// futurer things might be like:
//  $ study ./path/file.js format highlight -o new-file.js

const absPathToStudy = path.join(process.cwd(), pathToStudy);

// // should you be allowed to open to a 404 path?
// //  it won't hurt anything, it'll just be a 404 page
// const isValidPath = fs.existsSync(absPathToStudy);
// if (!isValidPath) {
//   throw new Error(pathToStudy + ': is not a valid path');
// };


const defaultLenses = config['--defaults'];
const defaultLense = (fs.existsSync(absPathToStudy) && fs.lstatSync(absPathToStudy).isDirectory())
  ? defaultLenses.directory
  : defaultLenses[path.extname(pathToStudy)];

const queryMarker = defaultLense ? '?' : ''

// -- the following lines will need to be rewritten when config works --
// construct a url using global configurations and the user-provided sub-path
const pathToOpen = path.normalize(pathToStudy);
// const url = `http://localhost:${config.get('PORT')}/${pathToOpen}?${pluginName}`;
const url = `http://localhost:4600/${pathToOpen}${queryMarker}${defaultLense}`;
console.log('studying: ', url);


// launch the server
require('../server/index.js')
  .then(_ => require('open')(url));




/*
  go to ../server/index.js for the next step in your journey
*/
