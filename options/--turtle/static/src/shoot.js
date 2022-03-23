import * as Vector from './vector.js'

let shooting = false
let shooting_started = false
let shooting_stopped = false

let target = Vector.create(0, 0)
let target_size

const easy_size = 250
const medium_size = 100
const hard_size = 50

const easy = Symbol('Shoot: easy level')
const medium = Symbol('Shoot: medium level')
const hard = Symbol('Shoot: hard level')

const level_target_sizes = {
  [easy]: easy_size,
  [medium]: medium_size,
  [hard]: hard_size
}

const levels = {easy, medium, hard}

let attempts = 0

const random_integer = (floor = 0, ceiling = 1) => {
  const rand = (Math.random() * (ceiling - floor)) + floor

  return Math.round(rand)
}

const random_vector = (
  floor = Vector.create(0, 0),
  ceiling = Vector.create(1, 1)
  ) => 
    Vector.create(
      random_integer(floor.x, ceiling.x),
      random_integer(floor.y, ceiling.y)
    )

const origin = Vector.create(0, 0)

const random_position = (world) => random_vector(origin, world.size)

const start = (level = easy) => {
  if (shooting) return

  target_size = level_target_sizes[level]
  shooting_started = true 
}

const stop = () => { 
  if (!shooting) return

  shooting_stopped = true 
}

const renew_shot = (world) => {
  if (!shooting) return

  new_shot(world)
}

let starting_position = origin
let starting_heading = 0

const new_shot = (world) => {
  const new_target = random_position(world)
  const new_position = random_position(world)
  if (Vector.dist(new_target, new_position) < 50 + target_size) 
    return new_shot(world)
  
  starting_heading = random_integer(0, 360)
  target = new_target

  set_position(new_position)
  set_heading(starting_heading)
  erase()

  starting_position = new_position
  attempts = 0
}

const you_win = (world) => {
  const {draw} = world

  console.log('%cYOU WIN! Nice shot!', 'font-size: large')
  print(`It took you ${attempts} attempt${attempts === 1 ? '' : 's'}.`)

  draw.noLoop()
  setTimeout(() => new_shot(world))
  setTimeout(() => {
    print('Loading a new shoot scenario.')
    print(`If you'd like to stop playing shoot, type "stop_shoot()".`)
    draw.loop()
  }, 2000)
}

const nice_shot = (world) => {
  const {draw} = world

  print('Nice try! But close only counts in horseshoe and hand grenades.')
  print(`This was attempt number ${attempts}.`)


  draw.noLoop()
  setTimeout(() => {
    set_position(starting_position)
    set_heading(starting_heading)
  })
  setTimeout(() => {
    print('Give it another go.')
    print(`If you'd like to stop playing shoot, type "stop_shoot()".`)
    draw.loop()
  }, 1000)

}

const test_shot = (world) => {
  if (Vector.equal(position(), starting_position)) {
    return void null
  }

  attempts += 1

  if (Vector.dist(position(), target) < target_size) {
    return you_win(world)
  }

  nice_shot(world)
}

const render = (world) => {
  if (shooting_started) {
    print(`Starting shoot!
Try to hit the target with only one call to a move function.`)
    shooting_started = false
    shooting = true
    return new_shot(world)
  }

  if (!shooting) return

  if (shooting_stopped) {
    print('render//stop shooting called')
    shooting_stopped = false
    shooting = false
    reset()
    return print('Game over! Goodbye.')
  }

  const {draw} = world
  draw.noStroke()
  draw.circle(target.x, target.y, target_size)

  test_shot(world)
}

const api = {start, stop, renew_shot}

export {render, api, levels}
