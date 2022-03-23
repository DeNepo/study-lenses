'use strict';

const steppedLens = ({ resource, lenses, config }) => {
  lenses.study.locals.stepped =
    config.queryValue || lenses.study.locals.stepped || true;
  lenses.study.queryValue = config.queryValue;

  return lenses.study.use({ resource });
};

module.exports = steppedLens;
