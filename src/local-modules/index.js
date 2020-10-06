const fs = require('fs');
const path = require('path');

const isItADirectory = (nextPath) => fs.existsSync(path.join(__dirname, nextPath)) && fs.lstatSync(path.join(__dirname, nextPath)).isDirectory();

const localModulePaths = fs.readdirSync(__dirname)
  .filter(nextPath => path.extname(nextPath) === '.js' || isItADirectory(nextPath))
  .filter(nextPath => nextPath !== 'index.js');


// https://stackoverflow.com/a/57556554
const camelize = (str) => {
  let arr = str.split('-');
  let capital = arr.map((item, index) => index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item.toLowerCase());
  let capitalString = capital.join("");

  return capitalString;
}

const localModules = localModulePaths
  .map((nextPath) => {
    try {
      const isDirectory = isItADirectory(nextPath);
      if (isDirectory) {
        return {
          path: nextPath,
          module: require(path.join(__dirname, nextPath, 'index.js'))
        };
      } else {
        return {
          path: nextPath,
          module: require(path.join(__dirname, nextPath))
        };
      }
    } catch (err) {
      console.log(err)
      return null;
    }
  })
  .filter(entry => entry !== null)
  .reduce((all, next) => {
    const propertyName = camelize(next.path.replace('.js', ''));
    all[propertyName] = next.module;
    return all;
  }, {});


module.exports = localModules;
