let quickdraw = false

const noop = () => {}

const create = noop

const api = {
  start: () => { quickdraw = true },
  stop: () => { quickdraw = false }
}

const go_forward = () => {
  print('forward(10)')
  forward(10)
}

const go_back = () => {
  print('back(10)')
  back(10)
}

const turn_right = () => {
  print('right(15)')
  right(15)
}

const turn_left = () => {
  print('left(15)')
  left(15)
}

const do_quickdraw = (draw) => {

  const {UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW} = draw

  draw.keyPressed = () => {
    switch (draw.keyCode) {
      case UP_ARROW: return go_forward()
      case DOWN_ARROW: return go_back()
      case LEFT_ARROW: return turn_left()
      case RIGHT_ARROW: return turn_right()
      default: return
    }
  }
}

const stop_quickdraw = (draw) => {
  draw.keyPressed = noop
}

const render = (world) => {
  const {draw} = world

  if (quickdraw) do_quickdraw(draw)
  else stop_quickdraw(draw)

}

export {create, api, render}
