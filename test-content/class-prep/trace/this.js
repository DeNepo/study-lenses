function e() {}
e();

const obj = {
  e,
};
obj.e();

const f = obj.e;
f();

const g = obj.e.bind(obj);
g();
