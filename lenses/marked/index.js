const marked = require('marked');

const renderLense = async ({ resource }) => {

  if (resource.info.ext !== '.md') {
    return
  }

  try {
    resource.content = marked(resource.content);
    resource.info.ext = '.html';
  } catch (err) {
    console.log(err);
  }

  return {
    resource
  }
};

module.exports = renderLense;
