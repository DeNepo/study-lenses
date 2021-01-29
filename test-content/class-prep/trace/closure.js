const a = (b) => {
  const c = 3;
  const d = () => b + c;
  console.log(d());
  return d;
};

const e = a(2);
