export const manyFunctions = (max) => {
  if (typeof max !== "number") {
    throw new TypeError("max is not a number");
  }
  if (max < 0) {
    throw new RangeError("max is less than 0");
  }
  if (!Number.isInteger(max)) {
    throw new RangeError("max is not an integer");
  }

  const threeDivides = (n) => _;
  const fiveDivides = (n) => _;
  const fifteenDivides = (n) => _;

  const FizzBuzzOrNumber = (num) => {
    if (_) {
      return "FizzBuzz";
    } else if (_) {
      return "Fizz";
    } else if (_) {
      return "Buzz";
    } else {
      return num;
    }
  };

  // https://stackoverflow.com/a/33352604
  return [...Array(max).keys()].map(_);
};
