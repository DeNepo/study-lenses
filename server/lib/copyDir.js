const fsPromise = require('fs/promises');
const path = require('path');

// https://stackoverflow.com/a/64255382

async function copyDir(src, dest) {
  await fsPromise.mkdir(dest, { recursive: true });
  let entries = await fsPromise.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    entry.isDirectory()
      ? await copyDir(srcPath, destPath)
      : await fsPromise.copyFile(srcPath, destPath);
  }
}
exports.copyDir = copyDir;
