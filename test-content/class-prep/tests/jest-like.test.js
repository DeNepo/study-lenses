/*
  how to get a jest-like expect into the browser?
*/

"use strict";

// this comment describes how the function should behave
//  maybe the function does not do that!
//  the test will help you find out ;)

/**
 * replaces a specific entry in an array
 * this function does not modify the original array
 * @param {Array} arr - an array of items, one will be changed
 * @param {number} index - the index to replace
 * @param {any} newEntry - the value to put at that index
 * @returns {Array} a copy of the array with one entry modified
 */
const replaceEntry = (arr, index, newEntry) => {
  if (index < 0) {
    return "index cannot be less than 0";
  }

  const copy = [...arr];
  copy[index] = newEntry;
  return copy;
};

// the test cases describe what the function is expected to do
// can you read the tests & test results to figure out what the function actually does?
//  be sure to expand all the failing logs in the console!
describe("replaceEntry: replaces a specific entry in an array", () => {
  describe("replaceEntry checks for a valid index", () => {
    it("the index cannot be less than 0", () => {
      const expected = "index cannot be less than 0";
      const actual = replaceEntry(["a", "b", "c"], -1, "x");
      expect(actual).toEqual(expected);
    });
    it("the index can be 0", () => {
      const expected = ["x", "b", "c"];
      const actual = replaceEntry(["a", "b", "c"], 0, "x");
      expect(actual).toEqual(expected);
    });
  });
  describe("replaceEntry replaces the correct entry", () => {
    it("it can replace the first value", () => {
      const expected = ["x", "b", "c"];
      const actual = replaceEntry(["a", "b", "c"], 0, "x");
      expect(actual).toEqual(expected);
    });
    it("it can add a new value at 1", () => {
      const expected = ["a", "x", "c"];
      const actual = replaceEntry(["a", "b", "c"], 1, "x");
      expect(actual).toEqual(expected);
    });
    it("it can add the same value at 1", () => {
      const expected = ["a", "b", "c"];
      const actual = replaceEntry(["a", "b", "c"], 1, "b");
      expect(actual).toEqual(expected);
    });
    it("it can replace the last value", () => {
      const expected = ["a", "b", "x"];
      const actual = replaceEntry(["a", "b", "c"], expected.length - 1, "x");
      expect(actual).toEqual(expected);
    });
  });
  describe("replaceEntry has no side-effects", () => {
    it("it does not modify the argument array", () => {
      const argArray = ["a", "b", "c"];
      replaceEntry(argArray, 1, "x");
      expect(argArray).toEqual(["a", "b", "c"]);
    });
  });
  it("throws", () => {
    /*
x regular expression: error message matches the pattern
x string: error message includes the substring
x error object: error message is equal to the message property of the object
x error class: error object is instance of class
    */
    expect(() => {
      throw new Error("oop");
    }).toThrowError(new Error("oop"));
  });
});
