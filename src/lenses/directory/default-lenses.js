const mime = {
  'default': '',
  'md': 'live-study',
  'html': '',
  'txt': 'notepad',
  '': '',
  'js': 'live-study',
  'css': 'live-study',
  'json': 'json-formatter',
  'png': '',
  'jpeg': '',
  'jpg': '',
  'gif': '',
  'svg': '',
  'mmd': 'mermaid',
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

