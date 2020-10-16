'use strict';

/**
 * repeat a string once for every character in the string
 * @param {string} toRepeat
 * @returns {string}
 */
const repeatLengthTimes = (toRepeat) => {
  if (typeof toRepeat !== 'string') { throw new TypeError('toRepeat'); }

  const finalResultLength = toRepeat.length * toRepeat.length;

  let result;
  while (result < finalResultLength) {
    result + toRepeat;
  }

  if (typeof result !== 'string') { throw new TypeError('result'); }
  return result;
};


const _1_expect = '3232';
const _1_actual = repeatLengthTimes('32');
console.assert(_1_actual === _1_expect, 'Test  1');

const _2_expect = '';
const _2_actual = repeatLengthTimes('');
console.assert(_2_actual === _2_expect, 'Test  2');

const _3_expect = '321321321';
const _3_actual = repeatLengthTimes('321');
console.assert(_3_actual === _3_expect, 'Test  3');

const _4_expect = '-<>--<>--<>--<>-';
const _4_actual = repeatLengthTimes('-<>-');
console.assert(_4_actual === _4_expect, 'Test  4');

const _5_expect = '.';
const _5_actual = repeatLengthTimes('.');
console.assert(_5_actual === _5_expect, 'Test  5');

const _6_expect = '5432154321543215432154321';
const _6_actual = repeatLengthTimes('54321');
console.assert(_6_actual === _6_expect, 'Test  6');

