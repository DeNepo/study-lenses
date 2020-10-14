const mime = {
  'directory': 'hyf',
  'md': 'render',
  'html': '',
  'txt': '',
  '': '',
  'js': 'format&highlight',
  'jsx': '',
  'css': 'format&highlight',
  'json': 'json-explore',
  'png': '',
  'jpeg': '',
  'jpg': '',
  'gif': '',
  'svg': '',
  'ts': 'format&highlight',
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

