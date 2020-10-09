const fs = require('fs');
const path = require('path');

const config = require('config');

const isItADirectory = (nextPath) => fs.existsSync(path.join(__dirname, nextPath)) && fs.lstatSync(path.join(__dirname, nextPath)).isDirectory();

const lensePaths = fs.readdirSync(__dirname)
  .filter(nextPath => isItADirectory(nextPath));

const localOrigin = config.get('ORIGIN.local') + config.get('PORT');

const lenses = lensePaths
  .map((nextPath) => {
    try {
      return {
        module: require(path.join(__dirname, nextPath, 'index.js')),
        name: nextPath,
        // can configurize this for build
        static: {
          own: `${localOrigin}/${config.STATIC.own}-${nextPath}`,
          shared: `${localOrigin}/${config.STATIC.shared}`,
        }
      }
    } catch (err) {
      console.log(err)
      return null;
    }
  })
  .filter(entry => entry !== null);


module.exports = lenses;
