"use strict";

/* require('chai').expect

  A very common syntax in testing is the `expect` syntax:

    expect(actualValue).to.equal(expectedValue);

  chai supports this syntax, and it is also used in this repository

  https://www.chaijs.com/api/bdd/

*/

const expect = require('chai').expect;

describe("about expect", () => {

  describe("strict equality : ===", () => {
    it("passing", () => {
      expect(true).equal(true);
    });
    it("failing", () => {
      expect(true).equal(false);
    });
  });

  describe(".to : for readability", () => {
    // you can add .to. in your tests to make it more readable
    // this won't change how the test works
    it("passing", () => {
      expect(true).to.equal(true);
    });
    it("failing", () => {
      expect(true).to.equal(false);
    });
  });

  describe("deep equality", () => {
    // to compare arrays and objects you will need .deep
    // this will check that they store the same values
    //  remember isolate/reference-vs-value?
    it("passing array", () => {
      expect([1, 2, 3]).to.deep.equal([1, 2, 3]);
    });
    it("failing array", () => {
      expect([1, 2, 3]).to.deep.equal([1, "2", 3]);
    });
    it("passing object", () => {
      expect({ a: 1, b: 2 }).to.deep.equal({ b: 2, a: 1 });
    });
    it("failing object", () => {
      expect({ a: "x", b: 2 }).to.deep.equal({ b: 2, a: 1 });
    });
  });

  describe(".throw", () => {
    // this assertion checks to make sure a function throws an error
    // you wont' need to know this unless you make it to /using-errors
    it("passing", () => {
      const throwsCorrectError = () => {
        throw Error("hello");
      };
      expect(throwsCorrectError).to.throw(Error, "hello");
    });
    it("failing: wrong error", () => {
      const throwsWrongError = () => {
        throw TypeError("userName is not a string");
      };
      expect(throwsWrongError).to.throw(Error, "hello");
    });
    it("failing: does not throw", () => {
      const doesNotThrow = () => { };
      expect(doesNotThrow).to.throw(Error, "hello");
    });
  });
});
