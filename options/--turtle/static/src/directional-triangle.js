import * as v from './vector.js'

const init = () => ({
  position: v.create(0, 0),
  heading: 0,
  radius: 20,
  color: [150, 150, 150, 200],
  angle: v.to_radians(140)
})

const vertices = ({angle, radius}) => [
  v.create(radius, 0),
  v.rotate(angle, v.create(radius, 0)),
  v.rotate(-angle, v.create(radius, 0))
]

const draw_triangle = (draw, {angle, radius}) => {
  draw.beginShape()
  vertices({angle, radius}).forEach(({x, y}) => draw.vertex(x, y))
  draw.endShape(draw.CLOSE)
}

const create = (options) => ({...init(), ...options})

const render = (world, state) => {
  const {position, heading, radius, color, angle} = state
  const {x, y} = position
  const {draw} = world

  draw.fill(color)
  draw.noStroke()

  draw.push()
    draw.translate(x, y)
    draw.rotate(heading)
    draw_triangle(draw, {radius, angle})
  draw.pop()
}

export {create, render}