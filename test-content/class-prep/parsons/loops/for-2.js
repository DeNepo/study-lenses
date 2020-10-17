/*
  which logic will pass the assertion?
*/

let count = 0
for (let i = 0; i < 5; i++) {
  count += i
}
console.assert(count === 10, 'count should be 10')


count += count + i // distractor
count = i // distractor
count = count + 1 // distractor
