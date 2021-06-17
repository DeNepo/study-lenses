const __name__ = (arr) => {
  // these work, you need to use them with the right array methods
  const isNotNaN = (entry) => !Number.isNaN(entry);
  const castToNumber = (entry) => Number(entry);

  // fill in the array methods and which logic to use
  const numbers = arr._(_);
  const allValidNumbers = numbers._(_);

  return allValidNumbers;
};
