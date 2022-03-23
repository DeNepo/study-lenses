import * as Turtle from './turtle.js'
import * as Path from './path.js'
import * as Vector from './vector.js'
import {conform} from './types.js'
import * as Color from './color.js'

const create = (world) => {
  const turtle = Turtle.create({position: Vector.scale(0.5, world.size)})
  const path = Path.api.add_point(Path.create(), turtle.position)

  return {turtle, path}
}

const forward = ({turtle, path}, distance) => {
  distance = conform(Number, distance, 
    `You must tell the turtle how far to walk forward by giving it a number.
      You gave it a(n) ${typeof distance}. 
      You told it to walk forward ${distance}.`)

  turtle = Turtle.api.forward(turtle, distance)
  path = Path.api.add_point(path, turtle.position)

  return {turtle, path}
}

const back = ({turtle, path}, distance) => {
  distance = conform(Number, distance, 
    `You must tell the turtle how far to walk backwards by giving it a number. 
      You gave it a(n) ${typeof distance}. 
      You told it to walk forward by ${distance} steps.`)

  turtle = Turtle.api.back(turtle, distance)
  path = Path.api.add_point(path, turtle.position)

  return {turtle, path}
}

const left = ({turtle, path}, amount) => {
  amount = conform(Number, amount,
    `You must tell the turtle how far to turn left by giving it a number.
      You gave it a(n) ${typeof amount}. 
      You told it turn left by ${amount} degrees.`)

  turtle = Turtle.api.left(turtle, amount)

  return {turtle, path}
}

const right = ({turtle, path}, amount) => {
  amount = conform(Number, amount,
    `You must tell the turtle how far to turn right by giving it a number.
      You gave it a(n) ${typeof amount}. 
      You told it turn left by ${amount} degrees.`)

  turtle = Turtle.api.right(turtle, amount)

  return {turtle, path}
}

const color = ({turtle, path}, new_color) => {
  new_color = Color.conform(new_color)

  path = Path.api.set_color(path, new_color)

  return {turtle, path}
}

const show = ({turtle, path}) => {
  turtle = Turtle.api.show(turtle)

  return {turtle, path}
}

const hide = ({turtle, path}) => {
  turtle = Turtle.api.hide(turtle)

  return {turtle, path}
}

const pen_up = ({turtle, path}) => {
  path = Path.api.pen_up(path)

  return {turtle, path}
}

const pen_down = ({turtle, path}) => {
  path = Path.api.pen_down(path)
  path = Path.api.add_point(path, turtle.position)

  return {turtle, path}
}

const home = ({turtle, path}) => {
  if (Vector.equal(turtle.position, turtle.home.position)) 
    return {turtle, path}
  turtle = Turtle.api.home(turtle)
  path = Path.api.add_point(path, turtle.position)

  return {turtle, path}
}

const erase = ({turtle, path}) => {
  path = Path.api.add_point(Path.create(), turtle.position)

  return {turtle, path}
}

const clear_screen = (walker) => erase(home(walker))

const set_position = (state, position) => {
  position = Vector.conform(position, `The turtle's position must be a vector.`)

  state = pen_up(state)
  state.turtle = Turtle.api.set_position(state.turtle, position)
  state = pen_down(state)

  return state
}

const set_heading = ({turtle, path}, heading) => {
  heading = conform(Number, heading, 
    `The turtle's heading must be a number. You gave me a(n) ${typeof heading}: ${heading}.`)

  turtle = Turtle.api.set_heading(turtle, heading)

  return {turtle, path}
}

const api = {forward, back, left, right, color, show, hide, pen_up, pen_down, home, erase, clear_screen,
  fd: forward, bk: back, lt: left, rt: right, pu: pen_up, pd: pen_down, cs: clear_screen,
  set_position, set_heading
}

const update = (walker, [action, value]) => action in api ? api[action](value) : walker

const render = (world, {turtle, path}) => {
  Turtle.render(world, turtle)
  Path.render(world, path)
}

export {create, api, update, render}