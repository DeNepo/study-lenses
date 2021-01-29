(() => {
  const chai = require("chai");

  const expect = (value) => {
    const internals = {
      _obj: value,
      not: false,
    };
    // simplifying students' lives to use only a single stronger assertion
    //  the name toStrictEqual is confusing when compared to ===
    //  but still simpler than having to remember multiple assertions
    //  and i'm keeping .not but will not use it often
    const chainables = {
      toStrictEqual: function () {
        if (internals.not) {
          chai.assert.notDeepEqual(internals._obj, ...Array.from(arguments));
        } else {
          chai.assert.deepEqual(internals._obj, ...Array.from(arguments));
        }
      },
      toBe: function () {
        if (internals.not) {
          chai.assert.notEqual(internals._obj, ...Array.from(arguments));
        } else {
          chai.assert.equal(internals._obj, ...Array.from(arguments));
        }
      },
      toEqual: function () {
        if (internals.not) {
          chai.assert.notDeepEqual(internals._obj, ...Array.from(arguments));
        } else {
          chai.assert.deepEqual(internals._obj, ...Array.from(arguments));
        }
      },
      toThrowError: function () {
        /*
          x regular expression: error message matches the pattern
          x string: error message includes the substring
          x error object: error message is equal to the message property of the object
          x error class: error object is instance of class
        */
        if (internals.not) {
          chai.assert.doesNotThrow(internals._obj, ...Array.from(arguments));
        } else if (arguments[0] instanceof Error) {
          arguments[0] = arguments[0].message;
          chai.assert.throws(internals._obj, ...Array.from(arguments));
        } else {
          chai.assert.throws(internals._obj, ...Array.from(arguments));
        }
      },
    };
    Object.defineProperty(chainables, "not", {
      get: function () {
        internals.not = !internals.not;
        return chainables;
      },
    });
    return chainables;
  };

  window.expect = expect;
})();
