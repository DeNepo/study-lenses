export const solution = (arr) => {
  const areAllNumbers = arr.every((entry) => typeof entry === 'number');
  if (!areAllNumbers) {
    throw new TypeError('arr is not an array of numbers');
  }

  return arr.filter((entry) => entry % 2 === 0);
};

export const args = (chance) => {
  const randomValue = () => {
    const rando = Math.random();
    if (rando < 0.01) {
      return chance.word();
    } else if (rando < 0.97) {
      return chance.integer({ min: -999999999, max: 999999999 });
    } else if (rando < 0.98) {
      return true;
    } else if (rando < 0.99) {
      return false;
    } else {
      return null;
    }
  };
  const randomNumbers = [];
  const arraySize = Math.floor(Math.random() * 10);
  for (let i = 0; i < arraySize; i++) {
    randomNumbers.push(randomValue());
  }
  return [randomNumbers];
};
