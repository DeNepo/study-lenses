import { ADVICE } from "./advice/index.js";

export const run = () => {
  window.ADVICE = ADVICE;

  const aran = Aran({ namespace: "ADVICE" });
  const settedUp = aran.setup();
  // console.log(settedUp);
  const generated = Astring.generate(settedUp);
  // console.log(generated);
  window.eval(generated);

  return aran;
};

// export { aran };

// window.EMPTY = {};
// const expander = Aran({ namespace: "EMPTY" });
// const settedUpEx = expander.setup();
// // console.log(settedUp);
// const generatedEx = Astring.generate(settedUpEx);
// // console.log(generated);
// window.eval(generatedEx);

// export { expander };

/*
  i need to
    run the setup code in an iframe
    then run trace
*/
