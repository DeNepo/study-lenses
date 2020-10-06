const fs = require('fs');
const path = require('path');

const isItADirectory = (nextPath) => fs.existsSync(path.join(__dirname, nextPath)) && fs.lstatSync(path.join(__dirname, nextPath)).isDirectory();

const lensePaths = fs.readdirSync(__dirname)
  .filter(nextPath => isItADirectory(nextPath));


const lenses = lensePaths
  .map((nextPath) => {
    try {
      return {
        module: require(path.join(__dirname, nextPath, 'index.js')),
        name: nextPath
      }
    } catch (err) {
      console.log(err)
      return null;
    }
  })
  .filter(entry => entry !== null)
  .reduce((all, next) => {
    all[next.name] = next.module;
    return all;
  }, {});


module.exports = lenses;
