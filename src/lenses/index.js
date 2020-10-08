const fs = require('fs');
const path = require('path');

const config = require('../config/default.js');

const isItADirectory = (nextPath) => fs.existsSync(path.join(__dirname, nextPath)) && fs.lstatSync(path.join(__dirname, nextPath)).isDirectory();

const lensePaths = fs.readdirSync(__dirname)
  .filter(nextPath => isItADirectory(nextPath));


const lenses = lensePaths
  .map((nextPath) => {
    try {
      return {
        module: require(path.join(__dirname, nextPath, 'index.js')),
        name: nextPath,
        ownStatic: `${config.ORIGIN.local}/${config.STATIC.own}/${nextPath}/static`,
        sharedStatic: `${config.ORIGIN.local}/${config.STATIC.shared}`,
      }
    } catch (err) {
      console.log(err)
      return null;
    }
  })
  .filter(entry => entry !== null);


module.exports = lenses;
