export const solution = (arrOfNums) =>
  arrOfNums.filter((num) => num % 2 === 0).reduce((sum, next) => sum + next, 0);

export const args = () => {
  const randomNumbers = [];
  const arraySize = Math.floor(Math.random() * 10);
  for (let i = 0; i < arraySize; i++) {
    randomNumbers.push(Math.floor(Math.random() * 100));
  }
  return [randomNumbers];
};
