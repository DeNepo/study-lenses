export const solution = (val) => typeof val;

export const args = (chance) => {
  const rando = Math.random();
  let arg;
  if (rando < 0.4) {
    arg = chance.sentence();
  } else if (rando < 0.6) {
    arg = chance.floating();
  } else if (rando < 0.7) {
    arg = true;
  } else if (rando < 0.8) {
    arg = false;
  } else if (rando < 0.9) {
    arg = null;
  }
  return [arg];
};
