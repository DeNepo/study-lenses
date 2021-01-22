const b = (x) => (x === 0 ? x : b(x - 1) + x);

const r = b(3);
const s = b(4);

