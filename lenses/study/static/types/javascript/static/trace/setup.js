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
