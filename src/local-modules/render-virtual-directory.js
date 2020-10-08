const fs = require("fs");
const path = require("path");

const relativeRoot = process.cwd();

const alphabetically = (x, y) => {
  const xName = x.name.toLowerCase();
  const yName = y.name.toLowerCase();
  if (xName < yName) {
    return -1;
  }
  if (xName > yName) {
    return 1;
  }
  return 0;
};
const byDirOrFile = (x, y) => {
  const xIsDir = x.type === 'directory';
  const yIsDir = y.type === 'directory';
  if (xIsDir && yIsDir) {
    return 0;
  }
  if (xIsDir && !yIsDir) {
    return -1;
  }
  return 1;
};
const deepSort = (dirElement) => {
  if (Array.isArray(dirElement.children)) {
    for (const child of dirElement.children) {
      deepSort(child);
    };
    dirElement.children.sort(alphabetically);
    dirElement.children.sort(byDirOrFile);
  };
};

const register = (nextPath, parent = { path: '' }, gitignore = []) => {

  const thisPathAbs = path.normalize(path.join(relativeRoot, parent.path, nextPath));
  if (fs.existsSync(thisPathAbs) && fs.statSync(thisPathAbs).isFile()) {
    const fileParentPath = parent.path.replace(path.basename(nextPath), '');
    const filePath = path.join(parent.path, nextPath);
    return {
      parent: fileParentPath[0] === '/' ? fileParentPath.slice(1) : fileParentPath,
      path: filePath[0] === '/' ? filePath.slice(1) : filePath,
      type: 'file',
      name: path.basename(nextPath).replace('/', '')
    };
  }


  const virDirParent = parent.path.replace(path.basename(nextPath), '');
  const virDirPath = path.join(parent.path, nextPath);
  const virDir = {
    parent: virDirParent[0] === '/' ? virDirParent.slice(1) : virDirParent,
    path: virDirPath[0] === '/' ? virDirPath.slice(1) : virDirPath,
    type: 'directory',
    name: path.basename(nextPath).replace('/', ''),
    children: []
  };

  const paths = fs.readdirSync(thisPathAbs);

  if (paths.includes('.gitignore')) {
    gitignore = [];
    const toIgnore = fs.readFileSync(path.join(thisPathAbs, '.gitignore'), 'utf-8');
    toIgnore.split('\n').forEach(ignorable => {
      gitignore.push(ignorable);
    });
  }

  for (let nextSubPath of paths) {

    if (nextSubPath[0] === '.') { continue; }
    if (gitignore.includes(nextSubPath)) { continue; }


    const nextPathAbs = path.join(thisPathAbs, nextSubPath);
    if (!fs.existsSync(nextPathAbs)) { continue }

    const nextChild = register(nextSubPath, virDir, gitignore);
    if (nextChild !== null) {
      virDir.children.push(nextChild);
    }

  };


  deepSort(virDir);

  return virDir;
};



module.exports = register;
