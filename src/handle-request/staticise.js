const path = require('path');

const STATIC_PATH = path.join(path.relative(process.cwd(), __dirname), '../lenses');
const STATIC_PSEUDONYM = 'lense-resource';
const staticize = (reqPath) => {
  if (!reqPath.includes(STATIC_PSEUDONYM)) {
    return reqPath
  }
  const splitPath = reqPath.split(STATIC_PSEUDONYM);
  const staticRelPath = splitPath[1];
  const staticPath = path.join(STATIC_PATH, staticRelPath);
  return staticPath;
};

module.exports = staticize;
