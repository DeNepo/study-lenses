/*
  declare `aString` and initialize to "five"
  cast `aString` to type "number"
  declare `aNumber` and initialize the the cast string
  declare `whatIsIt`
  compare the value of `aNumber` to 5
  compare the value of `aNumber` to '5'
  assign `whatIsIt` to "not a number (NaN)"
  log the value of `whatIsIt`

  assign `whatIsIt` to "the number 5" // distractor
  assign `whatIsIt` to "the string "5"" // distractor


*/

const aString = "five";
const aNumber = Number(aString);

let whatIsIt;
if (aNumber === 5) {
  whatIsIt = "the number 5";
} else if (aNumber === "5") {
  whatIsIt = 'the string "5"';
} else {
  whatIsIt = "not a number (NaN)";
}

console.log(whatIsIt);
