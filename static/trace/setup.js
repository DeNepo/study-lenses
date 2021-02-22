"use strict";

import { ADVICE } from "./advice/index.js";

window.ADVICE = ADVICE;

const aran = Aran({ namespace: "ADVICE" });
const settedUp = aran.setup();
// console.log(settedUp);
const generated = Astring.generate(settedUp);
// console.log(generated);
window.eval(generated);

export { aran };

// window.EMPTY = {};
// const expander = Aran({ namespace: "EMPTY" });
// const settedUpEx = expander.setup();
// // console.log(settedUp);
// const generatedEx = Astring.generate(settedUpEx);
// // console.log(generated);
// window.eval(generatedEx);

// export { expander };
