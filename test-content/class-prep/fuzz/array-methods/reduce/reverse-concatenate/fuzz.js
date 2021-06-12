export const solution = (arr) =>
  [...arr].reverse().reduce((acc, next) => acc + next, "");

export const args = (chance) => {
  const newArgument = [];
  const arraySize = Math.floor(Math.random() * 10);
  for (let i = 0; i < arraySize; i++) {
    newArgument.push(chance.word());
  }
  return [newArgument];
};
