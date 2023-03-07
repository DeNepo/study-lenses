const fs = require('fs');
const path = require('path');

// https://stackoverflow.com/a/49421028

function emptyDir(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    for (const fileName of files) {
      fs.unlinkSync(path.join(dirPath, fileName));
    }
  } catch (err) {
    console.log(err);
  }
}
exports.emptyDir = emptyDir;

// const fsPromise = require('fs/promises');
// const path = require('path');

// // https://stackoverflow.com/a/49421028

// async function emptyDir(dirPath) {
//   try {
//     const files = await fsPromise.readdir(dirPath);
//     const unlinkPromises = files.map((filename) =>
//       fsPromise.unlink(path.join(dirPath, filename)),
//     );
//     return await Promise.all(unlinkPromises);
//   } catch (err) {
//     console.log(err);
//   }
// }
// exports.emptyDir = emptyDir;
