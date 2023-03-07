const config = require('config');

const { copyDir } = require('./lib/copyDir');
const { emptyDir } = require('./lib/emptyDir');

let lastReset = Date.now();

const resetDemo = async (req, res, next) => {
  const itsBeenTooLong = Date.now() - lastReset > config.demo.resetDelay;

  if (itsBeenTooLong) {
    console.log('-------- BEGIN: resetting demo content --------');
    emptyDir(process.cwd(), config.demo.resetIgnore);
    await copyDir(config.demo.path, process.cwd(), config.demo.resetIgnore);
    lastReset = Date.now();
    console.log('-------- END: resetting demo content --------');
  }

  next();
};

module.exports = resetDemo;
