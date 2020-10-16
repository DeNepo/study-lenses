const renderTocDoc = require('./render-toc-doc.js');

const hyfLense = async ({ resource }) => {


  if (!resource.content || typeof resource.content === 'string') {
    return
  }


  resource.content = renderTocDoc(resource.content);
  resource.info.ext = '.html';

  return {
    resource
  };
};

module.exports = hyfLense;
