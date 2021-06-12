import { rfdc } from "./rfdc.js";
const clone = rfdc();

export const percentPass = (func, tests) => {
  const total = tests.length;
  let passes = 0;
  const failing = [];
  tests.forEach((test) => {
    const checkForSideEffects = !test.args.every(
      (entry) => entry === null || typeof entry !== "object"
    );
    const argsClone = checkForSideEffects ? clone(test.args) : null;
    const testReport = {
      args: clone(test.args),
      expect:
        test.expect instanceof Error
          ? test.expect.toString()
          : clone(test.expect),
    };
    let actual;
    try {
      if (test.throws) {
        // assert.throws(() => func(...test.args), test.expect);
        if (test.expect instanceof Error) {
          expect(() => func(...test.args)).toThrow(
            test.expect.constructor,
            test.expect.message
          );
        } else {
          let actual;
          let didThrow = false;
          try {
            func(...test.args);
          } catch (exception) {
            didThrow = true;
            actual = exception;
          }
          if (!didThrow) {
            expect.fail("[Function] did not throw");
          } else {
            expect(actual).toEqual(test.expect);
          }
        }
      } else {
        // actual = func(...test.args);
        // testReport.actual = actual;
        // assert.deepStrictEqual(actual, test.expect);
        const actual = func(...test.args);
        testReport.actual = actual;
        expect(actual).toEqual(test.expect);
      }
      if (checkForSideEffects) {
        testReport.checkForSideEffects = "fail";
        // assert.deepStrictEqual(test.args, argsClone);
        expect(test.args).toEqual(argsClone);
        testReport.checkForSideEffects = "pass";
      }
      passes++;
    } catch (err) {
      testReport.error = err;
      failing.push(testReport);
      // console.error(err);
    }
  });
  return {
    failing,
    passing: (passes / total) * 100,
  };
};
