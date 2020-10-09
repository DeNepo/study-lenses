const path = require('path');
const marked = require('marked');

const markedLense = async (simpReq, resource, config) => {
  const { absPath } = resource;

  if (path.extname(absPath) !== '.md') {
    return resource;
  }

  resource.content = marked(resource.content);
  resource.mime = 'text/html';

  return resource;
};

module.exports = markedLense;
