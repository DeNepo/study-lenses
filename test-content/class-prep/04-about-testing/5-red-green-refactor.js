'use strict';

/* Red, Green, Refactor
  this is an idea from Test Driven Development
  when you write code with tests you should follow this process:
  1. run the tests and see what fails (red)
  2. write some code to pass SOME of the failing tests (green)
  3. rewrite the passing code so it's better code but still passes (refactor)
  4. start over at 1

  the goal here is to build your solution in small steps,
  and to run your tests every time you make a change

  the example below has different steps of a full solution
  try commenting and uncomment the different steps to see what the tests do

*/

const assert = chai.assert;

/**
 * returns the value if it's a number
 * otherwise returns the type of the value
 * @param {any} value
 * @returns {(number|string)}
 */
const numberOrType = (value) => {
  // pass the first test
  return 14;

  // // pass the second test
  // if (value === 14) {
  //   return 14;
  // } else {
  //   return Infinity
  // }

  // // pass the third test
  // if (value === 14) {
  //   return 14;
  // } else if (Number.isNaN(value)) {
  //   return NaN
  // } else {
  //   return Infinity
  // }

  // // refactor for code quality
  // if (typeof value === 'number') {
  //   return value;
  // }

  // // // pass all the tests
  // if (typeof value === 'number') {
  //   return value;
  // } else {
  //   return typeof value;
  // }

};

describe('numberOrType', () => {
  describe('returns numbers unchanged', () => {
    it('returns 14', () => {
      const actual = numberOrType(14);
      assert.strictEqual(actual, 14);
    });
    it('returns Infinity', () => {
      const actual = numberOrType(Infinity);
      assert.strictEqual(actual, Infinity);
    });
    it('returns NaN', () => {
      const actual = numberOrType(NaN);
      assert.isNaN(actual);
    });
  });
  describe('returns the type of any other value', () => {
    it('returns the type of strings', () => {
      const actual = numberOrType('asdf');
      assert.strictEqual(actual, 'string');
    });
    it('returns the type of booleans', () => {
      const actual = numberOrType(false);
      assert.strictEqual(actual, 'boolean');
    });
    it('returns the type of null', () => {
      const actual = numberOrType(null);
      assert.strictEqual(actual, 'object');
    });
    it('returns the type of undefined', () => {
      const actual = numberOrType(undefined);
      assert.strictEqual(actual, 'undefined');
    });
  });
});





