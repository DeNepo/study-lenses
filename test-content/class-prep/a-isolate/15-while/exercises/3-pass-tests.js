'use strict';

/**
 * repeats a string, separated by spaces
 * each repetition is labeled with it's repetition number
 * @param {string} text - text to repeat
 * @param {number} repeats - number of times to repeat
 * @returns {string}
 */
const repeater = (text, repeats) => {
  if (typeof text !== 'string') { throw new TypeError('text'); }
  if (typeof repeats !== 'number') { throw new TypeError('repeats'); }

  while (_) {

  }

  if (typeof result !== 'string') { throw new TypeError('result'); }
  return result;
};


const _1_expect = '018 118 218 ';
const _1_actual = repeater('18', 3);
console.assert(_1_actual === _1_expect, 'Test  1');

const _2_expect = '0 1 2 ';
const _2_actual = repeater('', 3);
console.assert(_2_actual === _2_expect, 'Test  2');

const _3_expect = '';
const _3_actual = repeater('', 0);
console.assert(_3_actual === _3_expect, 'Test  3');

const _4_expect = '';
const _4_actual = repeater('asdf', 0);
console.assert(_4_actual === _4_expect, 'Test  4');

const _5_expect = '0_ 1_ ';
const _5_actual = repeater('_', 2);
console.assert(_5_actual === _5_expect, 'Test  5');

const _6_expect = '0-<=>- 1-<=>- 2-<=>- 3-<=>- ';
const _6_actual = repeater('-<=>-', 4);
console.assert(_6_actual === _6_expect, 'Test  6');

