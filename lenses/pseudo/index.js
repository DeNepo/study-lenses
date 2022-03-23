'use strict';

const pseudofy = require('./pseudofy');

const pseudoLens = async ({ resource, config }) => {
  if (resource.info.ext !== '.js') {
    return;
  }

  try {
    if (config.queryValue === 'js') {
      resource.content = pseudofy(resource.content, true);
    } else {
      resource.info.ext = '.pseudo.txt';
      resource.info.base = resource.info.base
        ? resource.info.base.replace('.js', '.pseudo.txt')
        : '.pseudo.txt';
      resource.content = pseudofy(resource.content);
    }
  } catch (err) {
    resource.info.ext = '.txt';
    resource.content = err.toString();
  }

  return {
    resource,
  };
};

module.exports = pseudoLens;
