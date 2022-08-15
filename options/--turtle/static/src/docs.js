const Color = {};
Color.name = 'Color';

const Vector = {};
Vector.name = 'Vector';

const Any = {};
Any.name = 'Any';

const Record = {};
Record.name = 'Record';

const Help = Symbol('Category: help');

const help_docs_description =
  'Logs the docs for a specific function then returns `help`.';
const help_docs = {
  name: 'help',
  arguments: [{ help_with: Function }],
  description: help_docs_description,
  returns: Function,
  example: {
    code: `help()
help(forward)
help(right)(left)
help(help)`,
    comment: help_docs_description,
  },
  category: 'help',
};

const help_functions = {
  help: help_docs,
};

const Turtle = Symbol('Category: turtle');

const forward = {
  name: 'forward',
  shortcut: 'fd',
  arguments: [{ distance: Number }],
  description: 'Moves the turtle forward by the amount passed as the argument.',
  example: {
    code: 'forward(100)',
    comment: 'Moves the turtle forward by 100 pixels/paces.',
  },
  category: 'turtle',
};

const back = {
  name: 'back',
  shortcut: 'bk',
  arguments: [{ distance: Number }],
  description:
    'Moves the turtle backward by the amount passed as the argument.',
  example: {
    code: 'back(50)',
    comment: 'Moves the turtle back by 50 pixels/paces.',
  },
  category: 'turtle',
};

const left = {
  name: 'left',
  shortcut: 'lt',
  arguments: [{ degrees: Number }],
  description:
    'Rotates the turtle left by the number of degrees passed as the argument.',
  example: {
    code: 'left(90)',
    comment: 'Rotates the turtle left by 90 degrees.',
  },
  category: 'turtle',
};

const right = {
  name: 'right',
  shortcut: 'rt',
  arguments: [{ degrees: Number }],
  description:
    'Rotates the turtle right by the number of degrees passed as the argument.',
  example: {
    code: 'right(60)',
    comment: 'Rotates the turtle right by 60 degrees.',
  },
  category: 'turtle',
};

const circle_left = {
  name: 'circle_left',
  shortcut: 'cl',
  arguments: [{ radius: Number }],
  description:
    'Tells the turtle to walk in a circle, turning to the left, with the radius passed as the argument.',
  example: {
    code: 'circle_left(100)',
    comment:
      "Draws a circle of radius 100 to the left of the turtle's position.",
  },
  category: 'turtle',
};

const circle_right = {
  name: 'circle_right',
  shortcut: 'cr',
  arguments: [{ radius: Number }],
  description:
    'Tells the turtle to walk in a circle, turning to the right, with the radius passed as the argument.',
  example: {
    code: 'circle_right(85)',
    comment:
      "Draws a circle of radius 85 to the right of the turtle's position.",
  },
  category: 'turtle',
};

const arc_left = {
  name: 'arc_left',
  shortcut: 'al',
  arguments: [
    { radius: Number },
    { optional: { degrees: Number, default_value: 90 } },
  ],
  description: `Tells the turtle to walk along an arc, turning to the left, with the radius passed as the first argument.
  The optional second argument determines the number of degrees the arc describes. The default is 90---a quarter circle.`,
  example: {
    comment: `Draws one half of a circle with a radius of 100 to the left of the turtle's position.`,
    code: `arc_left(100, 180)`,
  },
  category: 'turtle',
};

const arc_right = {
  name: 'arc_right',
  shortcut: 'ar',
  arguments: [
    { radius: Number },
    { optional: { degrees: Number, default_value: 90 } },
  ],
  description: `Tells the turtle to walk along an arc, turning to the right, with the radius passed as the first argument.
  The optional second argument determines the number of degrees the arc describes. The default is 90---a quarter circle.`,
  example: {
    comment: `Draws one quarter of a circle with a radius of 50 to the right of the turtle's position.`,
    code: `arc_right(50)`,
  },
  category: 'turtle',
};

const home = {
  name: 'home',
  arguments: [],
  description:
    'Sends the turtle to its starting (home) position. It does not change the state of the pen.',
  example: {
    code: 'forward(50); right(90); forward(50); home()',
    comment: `Draws a right triangle with two sides of 50.
Because home does not change the state of the pen, the hypoteneuse is drawn.`,
  },
  category: 'turtle',
};

const pen_up = {
  name: 'pen_up',
  shortcut: 'pu',
  arguments: [],
  description:
    'Lifts the "pen" off the "paper." After calling this the turtle will not draw along its path until pen_down is called.',
  example: {
    code: 'pen_up(); forward(50)',
    comment: `Moves the turtle forward 50 paces/pixels without drawing a line.`,
  },
  category: 'turtle',
};

const pen_down = {
  name: 'pen_down',
  shortcut: 'pd',
  arguments: [],
  description:
    'Puts the "pen" on the "paper." After calling this the turtle will draw along its path until pen_up is called.',
  example: {
    code: 'pen_up(); forward(50); pen_down(); forward(50)',
    comment: `Draws a line of 50 pixels starting 50 pixels from the turtle's position.`,
  },
  category: 'turtle',
};

const show = {
  name: 'show',
  arguments: [],
  description:
    'Shows the turtle. The turtle will be visible until hide is called. Has no effect if the turtle is already visible.',
  example: { code: 'show()', comment: 'Shows the turtle.' },
  category: 'turtle',
};

const hide = {
  name: 'hide',
  arguments: [],
  description: `Hides the turtle. The turtle will be hidden until show is called.
  The turtle will continue to move and draw normally while it is hidden.
  This is useful for saving images.`,
  example: { code: 'hide()', comment: 'Makes the turtle invisible.' },
  category: 'turtle',
};

const set_position = {
  name: 'set_position',
  arguments: [{ position: Vector }],
  description: `Sets the position of the turlte to the (x, y) coordinates specified by the vector passed as the argument. Does not draw to the path.`,
  example: {
    code: 'set_position({x: 200, y: 100})',
    comment: 'Moves the turtle to (200, 100).',
  },
  category: 'turtle',
};

const set_heading = {
  name: 'set_heading',
  arguments: [{ heading: Number }],
  description: `Sets the heading of the turtle to the number passed in as the argument.
  The heading corresponds to the compass reading on a map, with 0 being straight up.`,
  example: {
    code: 'set_heading(90)',
    comment: 'Sets the heading to 90, i.e. the turtle will point to the right.',
  },
  category: 'turtle',
};

const color = {
  name: 'color',
  arguments: [{ color: Color }],
  description: 'Sets the color of the path the turtle draws.',
  example: {
    code: 'color(red); forward(100)',
    comment: `Draws a red line of 100 pixels forward from the turtle's position.`,
  },
  category: 'turtle',
};

const turtle_functions = {
  forward,
  back,
  left,
  right,
  circle_left,
  circle_right,
  arc_left,
  arc_right,
  home,
  pen_up,
  pen_down,
  show,
  hide,
  set_position,
  set_heading,
  color,
};

const World = Symbol('Category: world');

const erase = {
  name: 'erase',
  arguments: [],
  description:
    'Erases the contents of the drawing. Does not affect the turtle.',
  example: {
    code: 'erase()',
    comment: 'Erases the path while leaving the turtle where it is.',
  },
  category: 'world',
};

const clear_screen = {
  name: 'clear_screen',
  shortcut: 'cs',
  arguments: [],
  description:
    'Clears the screen and sets the turtle in its home location. Equivalent to home + erase.',
  example: {
    code: 'clear_screen()',
    comment: 'Clears the screen and sends the turtle home.',
  },
  category: 'world',
};

const background = {
  name: 'background',
  shortcut: 'bg',
  arguments: [Color],
  description: 'Sets the background color for the drawing.',
  example: {
    code: 'background(dark_gray)',
    comment: 'Makes the background of the drawing dark gray.',
  },
  category: 'world',
};

const undo = {
  name: 'undo',
  arguments: [{ optional: { steps: Number, default_value: 1 } }],
  description: `Undoes the last set of instructions delivered to the turtle.
  The optional argument how many sets of instructions to undo. The default is 1.`,
  example: {
    code: 'undo(); undo(2)',
    comment: 'Undoes the last three actions.',
  },
  category: 'world',
};

const redo = {
  name: 'redo',
  arguments: [{ optional: { steps: Number, default_value: 1 } }],
  description: `Re-does any undone instructions delivered to the turtle.
  Giving new instructions to the turtle clears the redo cache.
  The optional argument how many sets of instructions to undo. The default is 1.`,
  example: { code: 'redo()', comment: 'Re-does the last undone action.' },
  category: 'world',
};

const define = {
  name: 'define',
  arguments: [{ name: String }, { procedure: Function }],
  description: `Defines a new procedure in the world.  \`define\` takes a (new) name and a procedure, after being defined a procedure you can use it anywhere you like.  Your defined procedures are removed when the world is reset.`,
  example: {
    code: `define('square', (size) => {
  repeat(4, () => {
    forward(size)
    right(90)
  })
})

square(20)
square(40)`,
    comment:
      'Defines a new procedure named `square` that makes squares of any size.',
  },
  category: 'world',
};

const reset = {
  name: 'reset',
  arguments: [],
  description: `Resets the turtle world to its original state.
  Mostly equivalent to: cs(); background(black); color(white).
  In addition, it deletes the undo history.`,
  example: { code: 'reset()', comment: 'Resets the the world.' },
  category: 'world',
};

const hard_reset = {
  name: 'hard_reset',
  arguments: [],
  description: `Reloads the page to reset the turtle world but also the functions stored in memory. You lose all your work.`,
  category: 'world',
};

const world_functions = {
  erase,
  clear_screen,
  background,
  undo,
  redo,
  reset,
  define,
  hard_reset,
};

const Information = Symbol('Category: information');

const print = {
  name: 'print',
  arguments: [{ to_print: Any }],
  description: 'Prints whatever argument you give it to the console.',
  example: {
    code: 'print("foo")',
    comment: 'Sends the string "foo" to the console.',
  },
  category: 'information',
};

const heading = {
  name: 'heading',
  arguments: [],
  returns: Number,
  description: 'Returns current heading of the turtle, in degrees.',
  example: {
    code: 'home(); heading()',
    comment: 'Gets the heading of the turtle--in this case, 0.',
  },
  category: 'information',
};

const position = {
  name: 'position',
  arguments: [],
  returns: Vector,
  description: 'Returns the current position of the turtle, as a vector.',
  example: {
    code: 'set_position({x: 100, y: 100}); position()',
    comment: `Gets the position of the turtle, in this case (100, 100), and represented as a vector: {x: 100, y: 100}.`,
  },
  category: 'information',
};

const state = {
  name: 'state',
  arguments: [],
  returns: Record,
  description: 'Returns the current state of the turtle, as a record.',
  example: {
    code: 'state()',
    comment: 'Gets the state of the turtle.',
  },
  category: 'information',
};

const report = {
  name: 'report',
  arguments: [],
  description: 'Prints the current state of the turtle to the console.',
  example: {
    code: 'report()',
    comment: 'Sends the state of the turtle to the console.',
  },
  category: 'information',
};

const information_functions = {
  print,
  heading,
  position,
  state,
  report,
};

const Control = Symbol('Category: control');

const repeat = {
  name: 'repeat',
  arguments: [{ times: Number }, { to_repeat: Function }],
  description: `Repeats the function passed as the second argument the number of times passed in the first argument.
  Passes the number of the repetion (starting at 0) to the function as the single argument.`,
  example: {
    code: `repeat(4, () => {
  forward(100)
  right(90)
})`,
    comment: 'Draws a square, repeating forward(100); right(90) four times.',
  },
  category: 'control',
};

const loop = {
  name: 'loop',
  arguments: [
    { times: Number },
    { to_loop: Function },
    { optional: { first_value: Any } },
  ],
  returns: Any,
  description: `Repeats the function passed as the second argument the number of times passed in the first argument.
  Passes the output of one iteration to the following iteration as the first argument to the passed function.
  Passes the number of the repetition (starting at 0) to the passed function.
  A third, optional, argument specifies the value that is passed to the first iteration of the passed function.`,
  category: 'control',
};

const cond = {
  name: 'cond',
  arguments: [
    { condition: Any },
    { if_true: Function },
    { if_false: Function },
  ],
  returns: Any,
  description: `Executes one function or the other based on the value of the condition. if_true will be executed if the condition is truthy; if_false will be executed otherwise.`,
  example: {
    code: `silly_star = (angle) => {
  forward(100)
  right(angle)
  cond(heading() === 0,
    () => {},
    () => { silly_star(angle) }
  )
}`,
    comment: `Defines a silly_star function that keeps the turtle moving forward and turning right by the specified angle, until the heading reaches 0 (i.e. the star has been completed).`,
  },
  category: 'control',
};

const control_functions = { repeat, loop, cond };

const All = Symbol('Category: everything');

const all_functions = {
  ...help_functions,
  ...turtle_functions,
  ...world_functions,
  ...information_functions,
  ...control_functions,
};

const categories = {
  [Help]: 'Help',
  [Turtle]: 'Turtle',
  [World]: 'World',
  [Information]: 'Information',
  [Control]: 'Control',
  [All]: 'All',
};

const category_lists = {
  [Help]: help_functions,
  [Turtle]: turtle_functions,
  [World]: world_functions,
  [Information]: information_functions,
  [Control]: control_functions,
  [All]: all_functions,
};

const category_blurbs = {
  [Help]: 'A function with helpful instructions.',
  [Turtle]: 'Functions that change the state of the turtle.',
  [World]: "Functions that change the state of the turtle's world.",
  [Information]:
    'Functions that report information about the state of the turtle and world.',
  [Control]: 'Functions that manipulate control flow.',
  [All]: 'All the functions in Dirty Turtle (almost).',
};

const format_optional_argument = (arg) => {
  let { optional } = arg;
  let { default_value, ...info } = optional;
  let [label] = Object.keys(info);
  let [type] = Object.values(info);

  return `[Optional ${label}: ${type.name}${
    default_value === undefined ? '' : '; default: ' + default_value
  }]`;
};

const format_argument = (arg) => {
  let [label] = Object.keys(arg);
  let [type] = Object.values(arg);

  if (label === 'optional') return format_optional_argument(arg);

  return `${label}: ${type.name}`;
};

const display = (doc) => {
  console.log(
    `%cName: %c${doc.name}`,
    'color: gray; size: large',
    'color: black; font-weight: bold; size: large',
  );

  if (doc.shortcut)
    console.log(
      `%cShortcut: %c${doc.shortcut}`,
      'color: gray; size: large',
      'color: black; font-weight: bold; size: large',
    );

  console.log(
    `%cArguments:
%c${
      doc.arguments.length
        ? doc.arguments.map(format_argument).join(', ')
        : 'none'
    }`,
    'color: gray',
    'color: black; font-weight: bold;',
  );

  if (doc.returns)
    console.log(
      `%cReturns: %c${doc.returns.name}`,
      'color: gray',
      'color: black; font-weight: bold',
    );

  console.log(
    `%cDescription: %c${doc.description}`,
    'color: gray',
    'color: black',
  );

  if (doc.example)
    console.log(
      `%cExample:
${doc.example.comment}
%c${doc.example.code}`,
      'color: gray',
      'color: black',
    );
  console.log(
    `%cCategory: %c${doc.category}`,
    'color: gray',
    'color:black; font-weight: bold',
  );
};

Object.keys(all_functions).forEach((fn) => {
  const shortcut = all_functions[fn].shortcut;
  if (shortcut) {
    all_functions[shortcut] = all_functions[fn];
  }
});

window.help = help;

const help_assoc = Object.keys(all_functions).map((fn) => [
  window[fn],
  all_functions[fn],
]);

const help_map = new Map(help_assoc);

const list = (category = All) => {
  if (!category in categories) {
    console.warn(`I do not have a category ${category}.`);
    return;
  }

  const functions = category_lists[category];
  const blurb = category_blurbs[category];

  console.log(
    `%cCategory: %c${categories[category]}`,
    'color: gray',
    'color: black; font-weight: bold',
  );
  console.log(blurb);
  console.log(Object.keys(category_lists[category]).join(', '));
  console.log(
    'For more information on any of these functions, pass them as an argument to help(function_name).',
  );
};

function help(fn) {
  if (fn === undefined) {
    console.warn(`To use help, call help on a function or category.
    Below is a list of all categories and functions for which I have help entries.`);
    console.log(`%c***Categories:`, 'color: gray');
    console.log(`%cTurtle, World, Information, Control, Help`, 'color: black');
    console.log('......................................');
    console.log('%c***Functions:', 'color: gray');
    list();
    return;
  }
  if (fn in categories) {
    list(fn);
    return;
  }
  if (fn !== help && !help_map.has(fn)) {
    console.warn(`I do not have a help entry for ${fn.name || fn.toString()}.`);
    return;
  }

  const doc = help_map.get(fn);

  console.log('......................................');
  display(doc);
  console.log('......................................');

  return help;
}

Object.defineProperty(help, 'toString', {
  value: () => `help is a function and must be called in order to provide help.
  Try typing "help()".`,
});

export { help, list, All, Turtle, Information, World, Control };
