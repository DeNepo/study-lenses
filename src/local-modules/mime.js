
const mime = {
  'default': 'text/plain;charset=UTF-8',
  'md': 'text/markdown',
  'html': 'text/html;charset=UTF-8',
  'txt': 'text/plain;charset=UTF-8',
  '': 'text/plain;charset=UTF-8',
  'js': 'application/javascript',
  'css': 'text/css',
  'json': 'application/json',
  'png': 'image/png',
  'jpg': 'image/jpg',
  'gif': 'image/gif',
  'svg': 'image/svg+xml',
  'mmd': 'text/plain;charset=UTF-8',
};

module.exports = new Proxy(mime, {
  get: function (target, ext = '', receiver) {
    const pointlessExt = ext.replace('.', '');
    if (mime.hasOwnProperty(pointlessExt)) {
      return mime[pointlessExt];
    }
    return mime.default;
  }
});

