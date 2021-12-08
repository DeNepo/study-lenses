export const solution = (max) => {
  if (typeof max !== 'number') {
    throw new TypeError('max is not a number');
  }
  if (max < 0) {
    throw new RangeError('max is less than 0');
  }
  if (!Number.isInteger(max)) {
    throw new RangeError('max is not an integer');
  }

  const result = [];
  for (let i = 0; i < max; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      result.push('FizzBuzz');
    } else if (i % 3 === 0) {
      result.push('Fizz');
    } else if (i % 5 === 0) {
      result.push('Buzz');
    } else {
      result.push(i);
    }
  }
  return result;
};

export const args = (chance) => {
  const rando = Math.random();
  let arg;
  if (rando < 0.8) {
    arg = chance.integer({ min: 0, max: 100 });
  } else if (rando < 0.85) {
    arg = chance.integer({ min: -100, max: -1 });
  } else if (rando < 0.9) {
    arg = chance.floating({ min: -100, max: 100 });
  } else if (rando < 0.95) {
    arg = chance.floating({ min: -100, max: 100 });
  } else {
    const rando = Math.random();
    if (rando < 0.4) {
      arg = chance.sentence();
    } else if (rando < 0.6) {
      arg = chance.string();
    } else if (rando < 0.7) {
      arg = chance.bool();
    } else if (rando < 0.8) {
      arg = chance.falsy();
    } else if (rando < 0.9) {
      arg = Symbol(rando);
    }
  }
  return [arg];
};
