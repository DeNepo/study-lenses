import * as segment from './segment.js'
import * as Color from './color.js'

const create = () => ({
  past_segments: [],
  current_segment: segment.create(),
  pen_down: true,
  current_color: Color.colors.white
})

const api = {
  add_point: (path, point) => {
    const {pen_down, current_color} = path
    let {current_segment} = path

    if (pen_down === false) return path

    current_segment = segment.api.add_point(current_segment, [point, current_color])

    return {...path, current_segment}
  },

  pen_up: (path) => ({...path, pen_down: false}),

  pen_down: (path) => {
    let {pen_down, past_segments, current_segment} = path

    if (pen_down) return path

    pen_down = true

    past_segments = [...past_segments, current_segment]

    current_segment = segment.create()

    return {...path, past_segments, current_segment, pen_down}
  },

  set_color: (state, current_color) => ({...state, current_color})
}

const update = (state, [action, value]) => action in api ? api[action](value) : state

const render = (world, path) => {
  const {past_segments, current_segment} = path

  past_segments.forEach(s => segment.render(world, s))
  segment.render(world, current_segment)

  return path
}

export {create, api, update, render}
