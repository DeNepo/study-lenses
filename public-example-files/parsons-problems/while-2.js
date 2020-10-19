/*
  pass the assertion
*/

let pattern = '+'
while (string.length < 5) {
  pattern += '-'
}
pattern += '+'
console.assert(pattern === '+----+', 'the string should be "+----+"')
