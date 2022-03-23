import * as Types from './types.js'
import {assert} from './assert.js'

const {conform} = Types

const color = (r, g, b, a = 255) => [r, g, b, a]

const conform_to_color = c => {
  c = conform(Array, c, `Colors must be arrays. You gave me ${c}.`)
  assert(() => c.length === 4, `Colors must be arrays with four elements. You gave me ${c.length} elements.`)
  c.forEach((n, i) => conform(Number, n, `Colors must be arrays of numbers. You gave me ${typeof n}: ${n}, at index ${i}.`))

  return c
}

const colors = {
  red: color(255, 0, 0),
  green: color(0, 255, 0),
  blue: color(0, 0, 255),
  white: color(255, 255, 255),
  light_gray: color(180, 180, 180),
  gray: color(120, 120, 120),
  dark_gray: color(50, 50, 50),
  teal: color(49, 218, 224),
  fuchsia: color(221, 49, 224),
  pink: color(255, 117, 197),
  purple: color(147, 4, 214),
  orange: color(255, 148, 0),
  midnight: color(2, 0, 124),
  brown: color(84, 47, 0),
  yellow: color(255, 255, 0),
  cyan: color(0, 255, 255),
  lavender: color(217, 160, 255),
  olive: color(87, 91, 20),
  gold: color(193, 168, 7),
  black: color(0, 0, 0)
}

export {color, conform_to_color as conform, colors}
