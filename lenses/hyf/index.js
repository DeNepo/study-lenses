const renderTocDoc = require('./render-toc-doc.js');

const hyfLense = async ({ resource, config }) => {


  if (!resource.content || typeof resource.content === 'string') {
    return
  }


  resource.content = await renderTocDoc(resource.content, config);
  resource.info.ext = '.html';

  return {
    resource
  };
};

module.exports = hyfLense;


/* long-term
  detect SUMMARY.md files
  if they exist
    render something like a gitbook
    but with interactive markdown
*/
