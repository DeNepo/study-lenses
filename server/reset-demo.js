const fsPromise = require('fs/promises');
const fs = require('fs');
const path = require('path');

const config = require('config');
const { copyDir } = require('./lib/copyDir');
const { emptyDir } = require('./lib/emptyDir');

const reset = async (subPath) => {
  const backupPath = path.join(config.demo.path, subPath);
  const targetPath = path.join(process.cwd(), subPath);

  try {
    if ((await fsPromise.lstat(backupPath)).isDirectory()) {
      emptyDir(targetPath, config.demo.resetIgnore);
      await copyDir(backupPath, targetPath, config.demo.resetIgnore);
    } else {
      const backupContent = await fsPromise.readFile(backupPath, 'utf-8');
      await fsPromise.writeFile(targetPath, backupContent);
    }
  } catch (err) {
    console.error(err);
  }
};

const demoResetCache = new Map();

const resetDemo = async (req, res, next) => {
  // only handle requests that are trying to save changes
  if (req.method === 'POST') {
    // if there is a pending reset, remove it
    if (demoResetCache.has(req.path)) {
      clearInterval(demoResetCache.get(req.path));
      demoResetCache.delete(req.path);
    }

    // schedule new reset task
    const resetTimeoutId = setTimeout(() => {
      reset(req.path);
      demoResetCache.delete(req.path);
    }, config.demo.resetDelay);

    // add new timeout id to cache
    demoResetCache.set(req.path, resetTimeoutId);
  }

  next();
};

module.exports = resetDemo;
