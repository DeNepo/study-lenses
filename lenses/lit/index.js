'use strict';

// eventually be able to configure chunk comments by param & local

const path = require('path');

const simplit = require('./simplit');

const litLens = ({ resource, config }) => {
  if (!resource.info || resource.info.ext !== '.md') {
    return;
  }

  const { content, fileName } = simplit(
    config.queryValue
      ? resource.info.base.replace('.md', `.${config.queryValue}.md`)
      : resource.info.base,
    resource.content,
  );
  resource.content = content;
  resource.info.base = fileName;
  resource.info.name = path.basename(
    fileName.replace(path.extname(fileName), ''),
  );
  resource.info.ext = path.extname(fileName);

  return {
    resource,
  };
};

module.exports = litLens;
