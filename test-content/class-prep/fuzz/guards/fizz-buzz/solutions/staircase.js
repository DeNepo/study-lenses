export const staircase = (max) => {
  if (_) {
    throw new TypeError("max is not a number");
  }
  if (_) {
    throw new RangeError("max is less than 0");
  }
  if (_) {
    throw new RangeError("max is not an integer");
  }

  let countUp = _;
  const result = [];
  while (++countUp < max) {
    result.push(countUp % 15 === 0 ? "_" : _ ? "Buzz" : _ ? "Fizz" : _);
  }
  return result;
};
