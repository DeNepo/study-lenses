// Coding Challenge 121: Logo
// https://youtu.be/i-k04yzfMpw

let canvas;
let editor;
let editor_bg;
let turtle;
let recentreBtn;
let bgcolorBtn;

let draggingCanvas = false;
let dragStartMousePos = new p5.Vector();
let dragStartCanvasOffset = new p5.Vector();
let allCases;
let bgcolor = '#6040e6';

let resizingEditor = false;

// Used for scaling drawings to fit the canvas
let canvasScrollX = 0;
let canvasScrollY = 0;
let canvasScaleX = 1;
let canvasScaleY = 1;
let drawingBounds = new BoundingBox();
let drawingBoundsFirstPoint = true;
let centerAnimation = null;

let primary_keywords = ['fd', 'bd', 'rt', 'lt'];
let secondary_keywords = ['color', 'colorrgb', 'pensize', 'repeat', 'pu', 'pd'];

function syntaxHighlight(code) {
  let tokens = code
    .split(/(\[\s*\d+\s+\d+\s+\d+\s*\])|(\[)|(\])|(\s+)/)
    .filter((x) => x !== undefined && x != '');
  let newHTML = '';

  for (i of tokens) {
    if (primary_keywords.includes(i)) {
      // #f48771
      newHTML += `<strong><span style="color: #be5046">${i}</span></strong>`;
    } else if (secondary_keywords.includes(i)) {
      newHTML += `<span style="color: #15c1c1">${i}</span>`;
    } else if (['[', ']'].includes(i)) {
      newHTML += `<span style="color: #ffffff">${i}</span>`;
    } else if (/#[a-zA-z0-9]/.test(i) || /\[\s*\d+\s+\d+\s+\d+\s*\]/.test(i)) {
      newHTML += `<em><span style="color: #c678dd">${i}</span></em>`;
    } else if (parseInt(i) !== NaN) {
      newHTML += `<span style="color: #f5be4a">${i}</span>`;
    } else {
      newHTML += `<span style="color: #cccccc">${i}</span>`;
    }
  }

  return newHTML;
}

function showError(start, end) {
  let text = editor.value();
  start = start > 0 ? start + 1 : start;
  end = start < text.length ? end - 1 : end;

  let beforeErr = text.substring(0, start);
  let afterErr = text.substring(end);
  let err = text.substring(start, end);
  let bg_text = `${syntaxHighlight(
    beforeErr,
  )}<mark>${err}</mark>${syntaxHighlight(afterErr)}`;
  editor_bg.html(bg_text);
}

/*
 * Returns a function that waits for `delay` milliseconds and if it had not been called again, invokes `func`
 * If it _is_ called again within `delay` milliseconds, `func` is *not* invoked (yet) and the timer is reset.
 */
function debounce(func, delay) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func();
      timeout = null;
    }, delay);
  };
}

function canvasResized() {
  scaleToFitBoundingBox(drawingBounds, true);
}

const debouncedCanvasResized = debounce(canvasResized, 300);

function preload() {
  loadJSON(config.ownStatic + '/assets/tests.json', createTestDataView);
}

function getCanvasSize() {
  const bounds = select('#logo-canvas').elt.getBoundingClientRect();
  return { width: bounds.width, height: bounds.height };
}

function updateEditorOverlayMargin() {
  const editorBounds = select('#editor-container').elt.getBoundingClientRect();
  editor_bg.elt.style.right = `${
    editorBounds.width - editor.elt.scrollWidth - 3
  }px`;
}

function windowResized() {
  const canvasSize = getCanvasSize();
  resizeCanvas(canvasSize.width, canvasSize.height);
  updateResizeHandlePosition();
  debouncedCanvasResized();
  goTurtle();
  updateEditorOverlayMargin();
}

function setup() {
  const canvasSize = getCanvasSize();
  canvas = createCanvas(canvasSize.width, canvasSize.height);
  div = document.querySelector('#logo-canvas');

  div.appendChild(canvas.elt);

  // Use a setTimeout with length 0 to call windowResized immediately after the DOM has updated (since we are dynamically injecting a canvas element)
  setTimeout(() => {
    windowResized();
    scaleToFitBoundingBox(drawingBounds);
  }, 0);

  angleMode(DEGREES);
  background(bgcolor);

  canvas.mousePressed(function () {
    if (mouseIsPressed) {
      draggingCanvas = true;
      dragStartMousePos = new p5.Vector(mouseX, mouseY);
      dragStartCanvasOffset = new p5.Vector(canvasScrollX, canvasScrollY);
    }
  });

  canvas.mouseMoved(function () {
    if (mouseIsPressed && draggingCanvas) {
      canvasScrollX = dragStartCanvasOffset.x + dragStartMousePos.x - mouseX;
      canvasScrollY = dragStartCanvasOffset.y + dragStartMousePos.y - mouseY;
      goTurtle();
    }
  });

  canvas.mouseReleased(function () {
    draggingCanvas = false;
  });

  recentreBtn = document.querySelector('#recentre');
  bgcolorBtn = document.querySelector('#bgcolor');

  recentreBtn.onclick = function () {
    scaleToFitBoundingBox(drawingBounds, true);
  };

  bgcolorBtn.onclick = function () {
    let r = floor(random(0, 255));
    let g = floor(random(0, 255));
    let b = floor(random(0, 255));

    let hexR = `${r <= 15 ? '0' : ''}${r.toString(16)}`;
    let hexG = `${g <= 15 ? '0' : ''}${g.toString(16)}`;
    let hexB = `${b <= 15 ? '0' : ''}${b.toString(16)}`;

    let col = `#${hexR}${hexG}${hexB}`;
    bgcolor = col;
    goTurtle();
  };

  editor = select('#code');
  // setDefaultDrawing();
  editor.value(config.code);
  editor.input(() => {
    updateEditorContent();
    goTurtle();
  });
  editor_bg = select('#code_bg');
  scaleToFitBoundingBox(drawingBounds); // This also redraws (it has to in order to measure the size of the drawing)
  updateEditorContent();

  editor.elt.addEventListener(
    'scroll',
    (ev) => {
      select('#code_bg').elt.scrollTop = editor.elt.scrollTop;
    },
    { passive: true },
  ); // The 'passive: true' parameter increases performance when scrolling by making it impossible to cancel the scroll events
}

function scaleToFitBoundingBox(boundingBox, animate = false) {
  // If it's already animating, wait for it to finish
  if (centerAnimation !== null) return;

  // Run this once first so we can measure the size of the drawing
  goTurtle();

  // 15% padding around the drawing in the canvas
  let drawingPadding = Math.min(width, height) * 0.15;
  let scale = Math.min(
    (width - drawingPadding) / boundingBox.width,
    (height - drawingPadding) / boundingBox.height,
  );

  centerAnimation = new Animation(
    {
      // Starting values
      scaleX: canvasScaleX,
      scaleY: canvasScaleY,
      scrollX: canvasScrollX,
      scrollY: canvasScrollY,
    },
    {
      // Ending values
      scaleX: scale,
      scaleY: scale,
      scrollX: drawingBounds.x * scale - width * 0.5,
      scrollY: drawingBounds.y * scale - height * 0.5,
    },
    500, // Duration
    (values) => {
      // Update callback
      canvasScaleX = values.scaleX;
      canvasScaleY = values.scaleY;
      canvasScrollX = values.scrollX;
      canvasScrollY = values.scrollY;
      goTurtle();
    },
    () => {
      // Finished callback
      centerAnimation = null;
    },
    'EASE_IN_OUT_QUART', // Easing function
  );

  if (!animate) centerAnimation.skip();
}

function afterCommandExecuted() {
  if (turtle.pen) {
    if (drawingBoundsFirstPoint) {
      drawingBounds.reset();
      drawingBounds.move(turtle.x, turtle.y);
      drawingBoundsFirstPoint = false;
    } else {
      drawingBounds.includePoint(turtle.x, turtle.y);
      drawingBounds.includePoint(turtle.prevX, turtle.prevY);
    }
  }
}

function goTurtle() {
  turtle = new Turtle(0, 0, 0);
  drawingBoundsFirstPoint = true;
  background(bgcolor);

  push();
  translate(-canvasScrollX, -canvasScrollY);
  scale(canvasScaleX, canvasScaleY);

  push();
  turtle.reset();
  let code = editor.value();
  let parser = new Parser(code, afterCommandExecuted);
  try {
    let commands = parser.parse();
    for (let cmd of commands) {
      cmd.execute();
    }
  } catch (err) {
    showError(err.startIndex, err.endIndex);
  }

  pop();

  pop();
}

/**
 * Writes the Logo code for the default drawing to the textarea
 * Called on page load
 * Also called when selecting the default item from the #testdata dropdown
 */
function setDefaultDrawing() {
  editor.value(
    'pu lt 90 fd 100 lt 90 fd 250 rt 90 rt 90 pd fd 500 rt 90 fd 150 rt 90 fd 500 rt 90 fd 150',
  );
}

function createTestDataView(cases) {
  let selector = select('#testdata');

  selector.option('Logo Default', -1);

  for (i = 0; i < cases.length; i++) {
    selector.option(cases[i].name, i);
  }

  // because why not do it here
  selector.changed(function () {
    let val = parseInt(selector.value());
    if (val < 0) {
      // Use the default drawing
      setDefaultDrawing();
    } else {
      // Use a drawing from tests.json
      editor.value(cases[val].code);
    }

    // Reset default parameters for turtle
    turtle.strokeColor = 255;
    turtle.dir = 0;
    turtle.x = 0;
    turtle.y = 0;

    // Reset default parameters for camera
    canvasScrollX = 0;
    canvasScrollY = 0;
    canvasScaleX = 1;
    canvasScaleY = 1;

    // Move and scale the drawing to fit on-screen
    scaleToFitBoundingBox(drawingBounds);

    updateEditorOverlayMargin();
    updateEditorContent();
  });
}

function updateResizeHandlePosition() {
  // const resizeHandle = select('#resize-handle').elt;
  // const editorBounds = select('#editor-container').elt.getBoundingClientRect();
  // resizeHandle.style.top = `${editorBounds.top - 8}px`;
  // resizeHandle.style.width = `${editorBounds.width}px`;
}

function updateEditorSize(mouseY) {
  // const resizeHandleBounds =
  //   select('#resize-handle').elt.getBoundingClientRect();
  const editorBounds = select('#editor-container').elt.getBoundingClientRect();
  select('#editor-container').elt.style.height = `${
    editorBounds.bottom - mouseY - 8
  }px`;
  windowResized();
  updateResizeHandlePosition();
}

function updateEditorContent() {
  editor_bg.html(syntaxHighlight(editor.value()));
}

function resizeHandleMouseDown(ev) {
  resizingEditor = true;
  ev.preventDefault();
  return false;
}

function windowMouseMove(ev) {
  if (resizingEditor) updateEditorSize(ev.clientY);
}

function windowMouseUp() {
  resizingEditor = false;
  updateResizeHandlePosition();
}

// document
//   .getElementById('resize-handle')
//   .addEventListener('mousedown', resizeHandleMouseDown);
document.addEventListener('mousemove', windowMouseMove);
document.addEventListener('mouseup', windowMouseUp);

const getSelectedLines = () => {
  const textarea = document.getElementById('code');

  const code = textarea.value;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  if (start === end) {
    return code;
  }

  const lines = textarea.value.split('\n');

  let chars = 0;
  let selectedLines = [];
  for (const line of lines) {
    // +1 because of split \n
    chars += line.length + 1;
    if (chars >= start) {
      selectedLines.push(line);
    }
    if (chars >= end) {
      break;
    }
  }

  const selection = selectedLines.join('\n');

  return selection;
};

const openWithHandler = (event) => {
  const lens = event.target.id;

  const ext = lens === 'parsons=diff' ? '.txt' : '.js';
  const pseudoResource = {
    resource: {
      content: getSelectedLines(),
      info: {
        ext,
        base: ext,
        type: 'file',
      },
    },
  };

  const stringifiedResource = encodeURIComponent(
    JSON.stringify(pseudoResource),
  );

  const resourceQuery = `--resource=${stringifiedResource}`;

  const url = window.location.origin + `?${lens}&${resourceQuery}`;

  window.open(url, '_blank');
};

document.getElementById('parsons').addEventListener('click', openWithHandler);
document.getElementById('highlight').addEventListener('click', openWithHandler);
document.getElementById('print').addEventListener('click', openWithHandler);
document
  .getElementById('parsons=diff')
  .addEventListener('click', openWithHandler);

const saveButton = document.getElementById('save');
if (saveButton) {
  window.save = () => {
    fetch(window.location.origin + window.location.pathname + '?logo', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: editor.value() }),
    })
      .then((response) => response.text())
      .then((message) => {
        alert(message);
        console.log(message);
      })
      .catch((err) => {
        alert(err.name + ': ' + err.message);
        console.error('Error:', err);
      });
  };

  saveButton.addEventListener('click', window.save);
}

const logDoc = (name, description, example) => {
  console.log(
    `%c\n---   ${name}   ---\n`,
    'font-weight: bold;',
    `${description}:`,
    `\n\n->  ${example}`,
  );
};

const docs = [
  [
    'Forward',
    "Moves the turtle forward, in the direction that it's facing, by the specified distance (measured in turtle steps)",
    'fd units',
  ],
  [
    'Backwards',
    "Moves the turtle backward, i.e., exactly opposite to the direction that it's facing, by the specified distance. (The heading of the turtle does not change.)",
    'bd units',
  ],
  [
    'Right',
    'Turns the turtle clockwise by the specified angle, measured by default in degrees (1/360 of a circle)',
    'rt angle',
  ],
  [
    'Left',
    'Turns the turtle counterclockwise by the specified angle, measured by default in degrees (1/360 of a circle)',
    'lt angle',
  ],
  ['Pen Up', "Sets the pen's position to UP, without changing its mode", 'pu'],
  [
    'Pen Down',
    "Sets the pen's position to DOWN, without changing its mode",
    'pd',
  ],
  [
    'Pen Size',
    "Sets the thickness of the pen with the given the value. Note: If it's given a negative value, by default will be thickness of 1",
    'pensize thicknessValue',
  ],
  [
    'Set X Y',
    'Moves the turtle to an absolute position in the graphics window. The two inputs are numbers, the X and Y coordinates',
    'setxy coordinateX coordinateY',
  ],
  [
    'Set X',
    'Moves the turtle horizontally from its old position to a new absolute horizontal coordinate. The input is the new X coordinate',
    'setx coordinateX',
  ],
  [
    'Set Y',
    'Moves the turtle vertically from its old position to a new absolute vertical coordinate. The input is the new Y coordinate',
    'sety coordinateY',
  ],
  ['Home', 'Moves the turtle to the center of the screen', 'home'],
  ['Radians', 'Changes the angle values to be used as radians', 'radians'],
  ['Degrees', 'Changes the angle values to be used as degrees', 'degrees'],
  [
    'Repeat',
    'Runs the following instruction list repeatedly, num times. Can be nested',
    'repeat num [instruction list]',
  ],
  [
    'Color',
    'Sets the pen color given the hexadecimal value in format #FFF / #FFFFFF',
    'color hexadecimalValue',
  ],
  [
    'Color RGB',
    'Sets the pen color given the RGB value',
    'colorrgb [red green blue]',
  ],
];

document.getElementById('guide').addEventListener('click', () => {
  docs.map((doc) => logDoc(...doc));

  alert('the LOGO guide is logged to your console.');
});
