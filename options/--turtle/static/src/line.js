const create = (from, to, color = [255, 255, 255, 255]) => ({from, to, color})

const render = (world, line) => {
  const {draw} = world
  const {from, to, color} = line

  draw.strokeWeight(1)
  draw.stroke(draw.color(...color))
  draw.line(from.x, from.y, to.x, to.y)

  return line
}

export {create, render}