
const mime = {
  'default': {
    type: 'text/plain;charset=UTF-8',
    lense: ''
  },
  'md': {
    type: 'text/markdown',
    lense: 'live-study'
  },
  'html': {
    type: 'text/html;charset=UTF-8',
    lense: ''
  },
  'txt': {
    type: 'text/plain;charset=UTF-8',
    lense: ''
  },
  '': {
    type: 'text/plain;charset=UTF-8',
    lense: ''
  },
  'js': {
    type: 'application/javascript',
    lense: 'live-study'
  },
  'css': {
    type: 'text/css',
    lense: 'live-study'
  },
  'json': {
    type: 'application/json',
    lense: 'json-formatter'
  },
  'png': {
    lense: 'image/png',
    lense: ''
  },
  'jpg': {
    lense: 'image/jpg',
    lense: ''
  },
  'gif': {
    type: 'image/gif',
    lense: ''
  },
  'mmd': {
    type: 'text/plain;charset=UTF-8',
    lense: 'mermaid'
  }
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

