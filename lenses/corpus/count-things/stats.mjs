const median = (items = [], order = (a, b) => b - a) => {
  // https://www.tutorialspoint.com/calculating-median-of-an-array-javascript
  const sorted = [...items].sort(order);
  if (sorted.length % 2 === 0) {
    const first = sorted[sorted.length / 2 - 1];
    const second = sorted[sorted.length / 2];
    return (first + second) / 2;
  } else {
    const mid = Math.floor(sorted.length / 2);
    return sorted[mid];
  }
};

const mean = (items = [], sum = (all, next) => all + next) =>
  items.length === 0 ? 0 : items.reduce(sum, 0) / items.length;

export const stats = (items = []) => {
  const stats = {};

  stats.median = median(items);
  stats.mean = mean(items);
  stats.stDeviation = Math.sqrt(
    mean(items.map((number) => (number - stats.mean) ** 2)),
  );

  return stats;
};
