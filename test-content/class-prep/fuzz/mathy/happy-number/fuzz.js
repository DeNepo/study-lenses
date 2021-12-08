// solution by Angus Croll:  https://github.com/angus-c/literary.js/blob/master/book/woolf/happy.js

// prettier-ignore
function happy(number) {

  var next, numerals, noneOfThese = [];

  //unless the number was nothing; or one; or unless it had been already tried
  while (number && number != 1 && noneOfThese[number] == null) {
    next = 0, numerals = String(number).split('')
    //digits forced apart, now multiplied, now cast aside; in service of what?
    while (next = next+numerals[0]*numerals[0], numerals.shift(), numerals.length);
    noneOfThese[number] = true, number = next
  }

  //to be one; alone; happily
  return number == 1
}

export { happy as solution };

export const args = (chance) => [chance.integer({ min: 0, max: 99 })];
