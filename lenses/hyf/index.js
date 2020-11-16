const renderTocDoc = require('./render-toc-doc.js');


const hyfLense = async ({ resource, config }) => {


  if (!resource.content || typeof resource.content === 'string') {
    // refactor to render with default
    return
  }

  // see the directory resource schema from DOCS.md
  if (Array.isArray(resource.content.children)) {
    for (const child of resource.content.children) {
      if (child.base.toLowerCase() === 'summary.md') {
        return {
          abort: true
        }
      }
    }
  }

  resource.content = await renderTocDoc({
    virDir: resource.content,
    config,
    top: true
  });

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
