const config = require('config');

const { copyDir } = require('./lib/copyDir');
const { emptyDir } = require('./lib/emptyDir');

let lastReset = Date.now();
const resetDemo = async (req, res, next) => {
  const itsBeenTooLong = Date.now() - lastReset > config.demoResetDelay;
  // console.log(itsBeenTooLong);
  if (itsBeenTooLong) {
    console.log('-------- BEGIN: resetting demo content --------');
    await emptyDir(process.cwd());
    await copyDir(config.demoPath, process.cwd());
    lastReset = Date.now();
    console.log('-------- END: resetting demo content --------');
  }

  next();
};

module.exports = resetDemo;
