'use strict';

const p5Lens = ({ resource, lenses }) => {
  if (resource.info.ext !== '.js') {
    return;
  }

  resource.info.base = '.p5.js';

  return lenses.study.use({ resource });
};

module.exports = p5Lens;
