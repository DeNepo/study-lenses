const b = (x) => {
  if (x === 0) {
    return x;
  } else {
    return b(x - 1) + x;
  }
};

const r = b(3);
const s = b(4);