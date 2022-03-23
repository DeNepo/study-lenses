const round = (x, precision = 5) => Number(x.toFixed(precision))

const mult = (x, y) => x * y

const add = (x, y) => x + y

const sub = (x, y) => x - y

const div = (x, y) => x / y

const is_real = n => typeof n === 'number' && !Number.isNaN(n)

const is_integer = n => n % 1 === 0

const not_zero = n => n !== 0

export {round, mult, add, sub, div, is_real, is_integer, not_zero}