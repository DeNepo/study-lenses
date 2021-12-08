export const soShort = (max) => {
  if (typeof max !== 'number') {
    throw new _('_');
  }
  if (max < 0) {
    throw new _('_');
  }
  if (!Number.isInteger(max)) {
    throw new _('_');
  }

  const result = [];
  for (let i = 0; i < _; )
    result._((++i % _ ? '' : '_') + (i % _ ? '' : '_') || i);
  return result;

  // https://codeburst.io/javascript-breaking-down-the-shortest-possible-fizzbuzz-answer-94a0ad9d128a
};
