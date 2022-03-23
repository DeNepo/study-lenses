import * as v from './vector.js'
import * as triangle from './directional-triangle.js'

// api functions & object
const forward = (state, amount) => {
  const {heading} = state
  let {position} = state

  position = v.add(position, v.scale(amount, v.from_compass(heading)))

  return {...state, position, heading}
}

const back = (state, amount) => forward(state, amount * -1)

const right = (state, amount) => {
  let {heading} = state

  heading = v.round((360 + (heading + (amount % 360))) % 360, 3)

  return {...state, heading}
}

const left = (state, amount) => right(state, amount * -1)

const show = state => ({...state, show: true})

const hide = state => ({...state, show: false})

const set_position = (state, position) => ({...state, position})

const set_heading = (state, heading) => ({...state, heading})

const home = (state) => ({...state, ...state.home})

const api = {forward, back, right, left, set_position, set_heading, show, hide, home}

// default initial position
const init = () => ({
  position: v.create(0, 0),
  heading: 0,
  show: true
})

// module functions
const create = (options) => {
  let state = init()
  state = {...state, ...options}
  state.home = {...state}

  return state
}

const update = (state, [command, arg] = []) => command in api ? api[command](state, arg) : state

const render = (world, state) => {
  const {heading, position, show} = state

  if (!show) return state

  const tri = triangle.create({position, heading: v.to_radians(heading - 90)})
  triangle.render(world, tri)

  return state
}

export {update, render, create, api}
