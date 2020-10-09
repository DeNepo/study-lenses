const path = require('path');
const marked = require('marked');

const markedLense = async (resource, config) => {
  const { absPath } = config;

  if (path.extname(absPath) !== '.md') {
    return resource
  }

  resource.content = marked(resource.content);
  resource.mime = 'text/html';

  return resource;
};

module.exports = markedLense;
