import {round} from './numbers.js'

const radians_to_degrees = radians => round(radians * 180 / Math.PI)

const degrees_to_radians = degrees => round(degrees / 180 * Math.PI)

const DEGREES = {
  circle: 360,
  from: x => degrees_to_radians(x),
  to = x => radians_to_degrees(x)
}

const RADIANS = {
  circle: 2 * Math.PI,
  from: x => x,
  to: x => x
}

const diff = units => (first, second) => {
  first = units.from(first)
  second = units.from(second)

  diff = Math.abs(second - first)

  return diff < units.circle / 2 ? diff : units.circle - diff
}

const similar = units => (first, second, precision = units.circle / 10000) => 
  diff(units)(first, second) <= precision

const sin = units => x => Math.sin(units.from(x))

const cos = units => x => Math.cos(units.from(x))

const atan2 = units => (x, y) => units.to(Math.atan2(y, x))

const fns = [diff, similar, sin, cos, atan2]

const radians = fns.reduce((obj, fn) => ({...obj, [fn.name]: fn(RADIANS)}), {})

const degrees = fns.reduce((obj, fn) => ({...obj, [fn.name]: fn(DEGREES)}), {})

export {degrees_to_radians, radians_to_degrees, radians, degrees}
