const mime = {
  'directory': 'hyf',
  'md': 'study',
  'html': '',
  'txt': '',
  '': '',
  'js': 'study',
  'jsx': '',
  'css': 'study',
  'json': 'json-explore',
  'png': '',
  'jpeg': '',
  'jpg': '',
  'gif': '',
  'svg': '',
  'ts': 'study',
  'mmd': 'mermaid',
  'default': ''
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

