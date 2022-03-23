import * as line from './line.js'

const create = () => ({
  lines: []
})

const api = {
  add_point: (segment, [point, color]) => {
    let {lines} = segment

    const last_line = lines.length 
      ? lines[lines.length - 1]
      : line.create(point, point, color)

    const new_line = line.create(last_line.to, point, color)

    lines = [...lines, new_line]

    return {lines}
  }
}

const update = (segment, [action, values]) => action in api ? api[action](segment, values) : segment

const render = (world, segment) => {
  const {lines} = segment
  const [_, ...tail] = lines

  tail.forEach(l => line.render(world, l))

  return segment
}

export {create, api, update, render}
