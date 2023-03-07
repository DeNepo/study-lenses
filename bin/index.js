#!/usr/bin/env node

/* this file is the entry point when launching `study` from the CLI */

const fs = require('fs');
const path = require('path');

const open = require('open');

process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '..', 'config');

const config = require('config');
const { copyDir } = require('../server/lib/copyDir');
const { emptyDir } = require('../server/lib/emptyDir');

/* The user can optionally launch a sub-path from the directory they are in
  if they do this, localhost will still serve from the root of the directory
    the browser will just open to the selected sub-path
  when global configuration is set, there will be default plugin options for different mime types
    then the browser will open to that sub-path with the appropriate queries
    -> localhost:xxxx/user/defined/path?default-plugins-for-mime-type
*/
const userArgs = process.argv.slice(2);
// use the first arg that doesn't match a port config

// is this a demo run?
const isDemo = userArgs.find((entry) => entry.includes('-demo-reset'));
if (isDemo) {
  const defaultDelay = 300000;
  const userDelay = isDemo.includes('=')
    ? Number(isDemo.split('=')[1])
    : defaultDelay;
  config.demoResetDelay = !Number.isNaN(userDelay) ? userDelay : defaultDelay;

  config.demoPath = path.join(__dirname, '..', '.temp-demo-content');

  // clear any old demos
  emptyDir(config.demoPath);
  copyDir(process.cwd(), config.demoPath);

  // https://stackoverflow.com/a/14032965
  function clearBackup() {
    console.log('========= clearing backup');
    emptyDir(config.demoPath);
  }
  //do something when app is closing
  process.on('exit', clearBackup.bind(null, { cleanup: true }));

  //catches ctrl+c event
  process.on('SIGINT', clearBackup.bind(null, { exit: true }));

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', clearBackup.bind(null, { exit: true }));
  process.on('SIGUSR2', clearBackup.bind(null, { exit: true }));
} else {
  config.demoResetDelay = null;
}

const pathToStudy =
  userArgs.find((entry) => entry[0] !== '-' && entry[1] !== '-') || '';
// todo
//   search process.argv for "-h"
//     log a little guide to the console
//   allow users to pass a port

// subsequent arguments can be interpreted as plugins to apply, overriding the default
//  $ study ./path/file.js format highlight
// futurer things might be like:
//  $ study ./path/file.js format highlight -o new-file.js

const absPathToStudy = path.join(process.cwd(), pathToStudy);
// const absPathToStudy = userArgs.includes("--sandbox")
//   ? path.join(__dirname, "..", "sandbox")
//   : path.join(process.cwd(), pathToStudy);

// // should you be allowed to open to a 404 path?
// //  it won't hurt anything, it'll just be a 404 page
// const isValidPath = fs.existsSync(absPathToStudy);
// if (!isValidPath) {
//   throw new Error(pathToStudy + ': is not a valid path');
// };

const defaultLenses = config.locals['--defaults'];
const defaultLense =
  fs.existsSync(absPathToStudy) && fs.lstatSync(absPathToStudy).isDirectory()
    ? defaultLenses.directory
    : defaultLenses[path.extname(pathToStudy)];

// user can define a port number to study
const cliPortSearch = process.argv.find((entry) => {
  if (/--port=[\d]*/i.test(entry)) {
    const portString = entry.split('=')[1];
    const portNumber = Number(portString);
    if (!Number.isNaN(portNumber) && portNumber >= 3000 && portNumber < 9000) {
      return true;
    }
    process.argv;
  }
  return false;
});
const cliPort =
  cliPortSearch !== undefined ? cliPortSearch.split('=')[1] : undefined;

const cliLensSearch = process.argv.find((entry) => /--lens=[\d]*/i.test(entry));
const cliLens =
  cliLensSearch !== undefined ? cliLensSearch.split('=')[1] : undefined;

let rootStudyConfig = {};
// hack: prefer lenses.json
try {
  rootStudyConfig = require(path.join(process.cwd(), 'study.json'));
} catch (o_0) {}
try {
  rootStudyConfig = require(path.join(process.cwd(), 'lenses.json'));
} catch (o_0) {}

/**
 * @param {Object} object
 * @param {string} key
 * @return {any} value
 * https://stackoverflow.com/a/47538066
 */
const getParameterCaseInsensitive = (object, key) => {
  return object[
    Object.keys(object).find((k) => k.toLowerCase() === key.toLowerCase())
  ];
};
const rootStudyConfigPort = getParameterCaseInsensitive(
  rootStudyConfig,
  '--port',
);
const rootStudyConfigPortValidated =
  !Number.isNaN(rootStudyConfigPort) &&
  rootStudyConfigPort >= 3000 &&
  rootStudyConfigPort < 9000
    ? rootStudyConfigPort
    : undefined;

const port =
  process.env.PORT || cliPort || rootStudyConfigPortValidated || config.PORT;

const queryMarker = defaultLense ? '?' : '';

// -- the following lines will need to be rewritten when config works --
// construct a url using global configurations and the user-provided sub-path
// should this not normalize? might it make url paths in windows backslashes?
const pathToOpen = path.normalize(pathToStudy);
// const url = `http://localhost:${port}/${pathToOpen}${queryMarker}${defaultLense}`;
const url = `http://localhost:${port}/${pathToOpen}${queryMarker}${
  cliLens || '--defaults'
}`;
const helpUrl = `http://localhost:${port}?--help`;

// launch the server
require('../server/index.js')(port).then((_) => {
  console.log('studying: ', url);
  if (!userArgs.includes('-no-open')) {
    open(url);
  }
  // if (config.locals["--help"]) {
  //   setTimeout(() => open(helpUrl), 200);
  // }
});

/*
  go to ../server/index.js for the next step in your journey
*/
