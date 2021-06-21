/*
  do not trace things happening inside built-in calls
  at least for now until can properly instrument

  but do allow console.logs

  why? pretend it's like only pointing at what happens in a visible line
*/

const logit = (thing) => console.log("__", thing);

const cb = (_) => {
  let variable;
  console.log(_);
  logit(_);
  return _;
};

cb(3);

const arr = [1, 2, 3, 4, 5].map(cb);
console.log(arr);

const el = document.createElement("div");
el.addEventListener("click", cb);
el.click();

function x() {}
x();
