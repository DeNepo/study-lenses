import * as Types from './types.js'

const {conform} = Types

const step = radius => forward(2 * Math.PI * radius / 360)

const circle_right = radius => {
  radius = conform(Number, radius, 
    `You must tell the turtle how big of a circle to walk along by giving it a number.
    You gave it a ${typeof radius}.
    You told it to walk in a circle with a radius of ${radius}.`)

  repeat(360, () => {step(radius), right(1)})
}

const circle_left = radius => {
  radius = conform(Number, radius, 
    `You must tell the turtle how big of a circle to walk along by giving it a number.
    You gave it a(n) ${typeof radius}.
    You told it to walk in a circle with a radius of ${radius}.`)

  circle_right(-radius)
} 

const arc_right = (radius, angle = 90) => {
  radius = conform(Number, radius, 
    `You must tell the turtle the radius of the arc to walk along by giving it a number.
    You gave it a(n) ${typeof radius}.
    You told it to walk in a circle with a radius of ${radius}.`)
  
  angle = conform(Number, angle,
    `You must tell the turtle how many degrees of the circle to walk along by giving it a number.
    You gave it a(n) ${typeof angle}.
    You told it to walk ${angle} degrees around the circle.`)

  repeat(angle, () => { step(radius); right(1) })
} 

const arc_left = (radius, angle = 90) => {
  radius = conform(Number, radius, 
    `You must tell the turtle the radius of the arc to walk along by giving it a number.
    You gave it a(n) ${typeof radius}.
    You told it to walk in a circle with a radius of ${radius}.`)
  
  angle = conform(Number, angle,
    `You must tell the turtle how many degrees of the circle to walk along by giving it a number.
    You gave it a(n) ${typeof angle}.
    You told it to walk ${angle} degrees around the circle.`)

  repeat(angle, () => { step(radius); left(1) })
}

export {circle_right, circle_left, arc_right, arc_left, circle_left as cl, circle_right as cr, arc_left as al, arc_right as ar}