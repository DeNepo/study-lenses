import * as w from './walker.js';
import * as v from './vector.js';
import { append, last, but_last } from './array.js';
import * as Types from './types.js';
import * as Color from './color.js';
import * as vocabulary from './arcs.js';
import * as quickdraw from './quickdraw.js';
import * as shoot from './shoot.js';

const { conform } = Types;
const { colors } = Color;
window.conform = conform;

// helper functions
const globalize = (obj) => {
  Object.keys(obj).forEach((key) => {
    window[key] = obj[key];
  });

  return obj;
};

// user-facing dsl/helper functions
const range = (size) => {
  size = conform(
    Number,
    size,
    `Argument to range must be a number. You gave me a(n) ${typeof size}: ${size}.`,
  );

  return [...Array(size)].map((_, i) => i);
};

const repeat = (times, fn) => {
  times = conform(
    Number,
    times,
    `First argument to repeat must be a number. You gave me a(n) ${typeof times}: ${times}.`,
  );
  fn = conform(
    Function,
    fn,
    `Second argument to repeat must be a function. You gave me a(n) ${typeof fn}: ${fn}.`,
  );

  range(times).forEach((time) => fn(time));

  const msg = fn.name || fn;
  return ok(repeat, times, msg);
};

const loop = (times, fn, first) => {
  times = conform(
    Number,
    times,
    `First argument to loop must be a number. You gave me a(n) ${typeof times}: ${times}.`,
  );
  fn = conform(
    Function,
    fn,
    `Second argument to loop must be a function. You gave me a(n) ${typeof times}: ${fn}.`,
  );

  return range(times).reduce((acc, time) => fn(acc, time), first);
};

const cond = (bool, if_true, if_false) => {
  if_true = conform(
    Function,
    if_true,
    `Second argument to cond must be a function. You gave me a(n) ${typeof if_true}: ${if_true}.`,
  );
  if_false = conform(
    Function,
    if_false,
    `Second argument to cond must be a function. You gave me a(n) ${typeof if_false}: ${if_false}.`,
  );

  return bool ? if_true() : if_false();
};

const define = (name, procedure) => {
  conform(
    String,
    name,
    `First argument to define must be a string. You gave me a(n) ${typeof name}: ${name}.`,
  );
  conform(
    Function,
    procedure,
    `Second argument to define must be a function. You gave me a(n) ${typeof procedure}: ${procedure}.`,
  );

  if (window.hasOwnProperty(name)) {
    conform(
      Function,
      window[name],
      `\`${name}\` already exists in this world, try defining your procedure again with a new name.`,
    );
  }

  globalize({ [name]: procedure });
};

const reset = () => {
  stop_quickdraw();
  stop_shoot();
  create(world.draw);
  return ok(reset);
};

const print = (x) => (console.log(x), x);

const position = () => world.walker.turtle.position;

const heading = () => world.walker.turtle.heading;

const current_color = () => world.walker.path.current_color;

const state = () => ({
  position: position(),
  heading: heading(),
  color: current_color(),
});

const report = () => {
  const { x, y } = position();
  let color = current_color();
  let named_color = Object.entries(colors)
    .filter(([_, value]) => value === color)
    .reduce((_, [name]) => name, '');
  print(
    `Position: (${x}, ${y}). Heading: ${heading()}. Color: ${
      named_color || color
    }.`,
  );

  return ok(report);
};

const undo = Function.tco((count = 1) => {
  count = conform(
    Number,
    count,
    `Argument to undo must be a number. You gave me a(n) ${typeof count}: ${count}.`,
  );

  if (count === 0) return ok(undo);

  if (world.stack.length <= 1) {
    console.warn('Nothing to undo.');
    return ok(undo);
  }

  world.redo = append(world.redo, last(world.stack));
  world.stack = but_last(world.stack);
  world.walker = last(world.stack);

  return undo(count - 1);
}, 'undo');

const redo = Function.tco((count = 1) => {
  count = conform(
    Number,
    count,
    `Argument to redo must be a number. You gave me a(n) ${typeof count}: ${count}.`,
  );

  if (count === 0) return ok(redo);

  if (world.redo.length === 0) {
    console.warn('Nothing to redo.');
    return ok(redo);
  }

  world.stack = append(world.stack, last(world.redo));
  world.redo = but_last(world.redo);
  world.walker = last(world.stack);

  return redo(count - 1);
}, 'redo');

const background = (color) => {
  color = Color.conform(color);

  world.background = color;

  return ok(background, color);
};

const hard_reset = () => window.location.reload();

const helpers = {
  range,
  repeat,
  loop,
  reset,
  undo,
  redo,
  print,
  background,
  bg: background,
  position,
  heading,
  current_color,
  state,
  report,
  hard_reset,
  cond,
  define,
};

const start_quickdraw = () => {
  quickdraw.api.start();
  return ok(start_quickdraw);
};
const stop_quickdraw = () => {
  quickdraw.api.stop();
  return ok(stop_quickdraw);
};

const start_shoot = (size) => {
  shoot.api.start(size);
  return ok(start_shoot, size);
};
const stop_shoot = () => shoot.api.stop();
const new_shot = () => shoot.api.renew_shot(world);

const games = {
  start_quickdraw,
  stop_quickdraw,
  start_shoot,
  stop_shoot,
  new_shot,
  ...shoot.levels,
};

const modules = { ...vocabulary, vector: v };

const world = {
  //fixed attributes
  size: v.create(800, 600),
};

const ok = (action, ...args) => {
  const action_name = action.name ? action.name : action;
  Object.defineProperties(ok, {
    toString: {
      value: () => `Ok: ${action_name}(${args.join(', ')})`,
      writable: true,
    },
    name: { value: 'ok', writable: true },
    msg: { value: [action_name, ...args], writable: true },
  });
  return ok;
};

const create = (draw) => {
  console.log('Hello world! I am turtle, make me draw.');

  //context-sensitive attributes
  world.draw = draw;

  //variable attributes
  world.walker = w.create(world);
  world.background = colors.black;
  world.stack = [];
  world.redo = [];

  const api = {};

  for (const action in w.api) {
    api[action] = (...args) => {
      world.redo = [];
      world.walker = w.api[action](world.walker, ...args);

      return ok(action, ...args);
    };
  }

  world.api = api;

  globalize({
    ...api,
    ...helpers,
    ...modules,
    colors,
    ...colors,
    ...games,
  });

  import('./docs.js').then((d) => globalize(d));

  return world;
};

const render = () => {
  if (world.stack[world.stack.length - 1] !== world.walker)
    world.stack = [...world.stack, world.walker];
  world.draw.background(world.background);
  w.render(world, world.walker);

  quickdraw.render(world);
  shoot.render(world);
};

export { create, render };
