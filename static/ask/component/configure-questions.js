export const configureOpenEnded = (option) => {
  if (option.includes('level')) {
    const level = Number(option.split('-').pop());
    const indexOfLevel = ask.config.levels.indexOf(level);
    if (indexOfLevel === -1) {
      ask.config.levels.push(level);
    } else {
      ask.config.levels.splice(indexOfLevel, 1);
    }
  } else if (
    ask.config[option] &&
    typeof ask.config[option].ask === 'boolean'
  ) {
    ask.config[option].ask = !ask.config[option].ask;
  }
};
