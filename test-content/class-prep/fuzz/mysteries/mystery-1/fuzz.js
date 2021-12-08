/**
 * Task description: Write a method that returns a duplicate-free array
 * Expected Result: Duplicate-free array [1, 2, 3, 1, 2] => [1, 2, 3]
 * Task Complexity: 2 of 5
 *
 * @param {string[]} array - Array of primitive data types.
 * @returns {Array}
 *
 * @author https://github.com/andrewborisov/javascript-practice/blob/master/arrays/solutions/06-unique.js
 */
export const solution = (array) => Array.from(new Set(array));

export const args = (chance) => {
  const values = [];
  const arraySize = Math.floor(Math.random() * 10);
  for (let i = 0; i < arraySize; i++) {
    const nextRando = chance.word();
    values.push(nextRando);
    if (Math.random() < 0.3) {
      values.push(nextRando);
    }
    if (Math.random() < 0.2) {
      values.push(nextRando);
    }
    if (Math.random() < 0.1) {
      values.push(nextRando);
    }
  }

  // https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = values[i];
    values[i] = values[j];
    values[j] = temp;
  }
  return [values];
};
