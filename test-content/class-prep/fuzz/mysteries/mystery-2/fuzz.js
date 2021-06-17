export const solution = (arr) =>
  arr.map((entry) => Number(entry)).filter((entry) => !Number.isNaN(entry));

export const args = (chance) => {
  const rando = () => {
    const probs = Math.random();
    return probs < 0.4
      ? chance.word({ syllables: 3 })
      : probs < 0.6
      ? String(chance.floating({ min: -999999999, max: 999999999 }))
      : String(chance.integer({ min: -999999999, max: 999999999 }));
  };
  const strings = [];
  const arraySize = Math.floor(Math.random() * 10);
  for (let i = 0; i < arraySize; i++) {
    strings.push(rando());
  }
  return [strings];
};
