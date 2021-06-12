export const solution = (arr) =>
  arr.filter((obj) => !obj.hasOwnProperty("pass") || obj.pass === true);

export const args = (chance) => {
  const rando = () => {
    const rando = Math.random();
    if (rando < 0.1) {
      return chance.word();
    } else if (rando < 0.6) {
      return chance.integer();
    } else if (rando < 0.7) {
      return true;
    } else if (rando < 0.8) {
      return false;
    } else if (rando < 0.9) {
      return null;
    }
  };
  chance.mixin({
    passable: function () {
      const entry = {
        title: chance.sentence({ words: chance.integer({ min: 1, max: 5 }) }),
        body: chance.paragraph(),
      };
      if (Math.random() < 0.8) {
        entry.pass = rando();
      }
      return entry;
    },
  });
  const passableObjects = [];
  const arraySize = chance.integer({ min: 0, max: 10 });
  for (let i = 0; i < arraySize; i++) {
    passableObjects.push(chance.passable());
  }
  return [passableObjects];
};
