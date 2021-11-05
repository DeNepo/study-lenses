// https://stackoverflow.com/questions/1145850/how-to-get-height-of-entire-document-with-javascript
const body = document.body,
  html = document.documentElement;

const height = Math.max(
  body.scrollHeight,
  body.offsetHeight,
  html.clientHeight,
  html.scrollHeight,
  html.offsetHeight
);

const width = Math.max(
  body.scrollWidth,
  body.offsetWidth,
  html.clientWidth,
  html.scrollWidth,
  html.offsetWidth
);

const colors = {
  white: [255, 255, 255],
  red: [255, 0, 0],
  green: [0, 255, 0],
  blue: [114, 223, 250],
  orange: [255, 179, 0],
  black: [0, 0, 0],
};

const cfd = new CanvasFreeDrawing.default({
  elementId: "cfd",
  width,
  height,
  showWarnings: true,
  lineWidth: 2,
  transparent: true,
  strokeColor: colors[config.locals.color]
    ? colors[config.locals.color]
    : colors.white,
  maxSnapshots: 100,
});

cfd.canvas.getContext("2d").fillStyle = "hsla(0, 0%, 100%, 0)";

document.getElementById("clear").addEventListener("click", () => cfd.clear());
document.getElementById("undo").addEventListener("click", () => cfd.undo());
document.getElementById("redo").addEventListener("click", () => cfd.redo());

let color = "white";
const setColor = {
  white: () => {
    const oldColorButton = document.getElementById(color);
    oldColorButton.innerHTML = oldColorButton.innerHTML.toLowerCase();
    color = "white";
    const newColorButton = document.getElementById(color);
    newColorButton.innerHTML = newColorButton.innerHTML.toUpperCase();

    cfd.setDrawingColor([255, 255, 255]);
  },
  red: () => {
    const oldColorButton = document.getElementById(color);
    oldColorButton.innerHTML = oldColorButton.innerHTML.toLowerCase();
    color = "red";
    const newColorButton = document.getElementById(color);
    newColorButton.innerHTML = newColorButton.innerHTML.toUpperCase();

    cfd.setDrawingColor([255, 0, 0]);
  },
  green: () => {
    const oldColorButton = document.getElementById(color);
    oldColorButton.innerHTML = oldColorButton.innerHTML.toLowerCase();
    color = "green";
    const newColorButton = document.getElementById(color);
    newColorButton.innerHTML = newColorButton.innerHTML.toUpperCase();

    cfd.setDrawingColor([0, 255, 0]);
  },
  blue: () => {
    const oldColorButton = document.getElementById(color);
    oldColorButton.innerHTML = oldColorButton.innerHTML.toLowerCase();
    color = "blue";
    const newColorButton = document.getElementById(color);
    newColorButton.innerHTML = newColorButton.innerHTML.toUpperCase();

    cfd.setDrawingColor([114, 223, 250]);
  },
  orange: () => {
    const oldColorButton = document.getElementById(color);
    oldColorButton.innerHTML = oldColorButton.innerHTML.toLowerCase();
    color = "orange";
    const newColorButton = document.getElementById(color);
    newColorButton.innerHTML = newColorButton.innerHTML.toUpperCase();

    cfd.setDrawingColor([255, 179, 0]);
  },
  black: () => {
    const oldColorButton = document.getElementById(color);
    oldColorButton.innerHTML = oldColorButton.innerHTML.toLowerCase();
    color = "black";
    const newColorButton = document.getElementById(color);
    newColorButton.innerHTML = newColorButton.innerHTML.toUpperCase();

    cfd.setDrawingColor([0, 0, 0]);
  },
};

const white = document.getElementById("white");
white.addEventListener("click", setColor.white);

const red = document.getElementById("red");
red.addEventListener("click", setColor.red);

const green = document.getElementById("green");
green.addEventListener("click", setColor.green);

const blue = document.getElementById("blue");
blue.addEventListener("click", setColor.blue);

const orange = document.getElementById("orange");
orange.addEventListener("click", setColor.orange);

const black = document.getElementById("black");
black.addEventListener("click", setColor.black);

const codeToolbar = document.getElementsByClassName("code-toolbar");
if (codeToolbar[0]) {
  codeToolbar[0].style.zIndex = 20;
}

{
  // eraser hacked together from - https://codepen.io/progrape/pen/XXBwWe

  // canvas setup
  const canvas = document.getElementById("cfd");
  const ctx = canvas.getContext("2d");

  // toggled variables
  let isPress = false;
  let old = null;

  // eraser handlers
  const eraserDown = (e) => {
    isPress = true;
    old = { x: e.offsetX, y: e.offsetY };
  };
  const eraserMove = (e) => {
    if (isPress) {
      const x = e.offsetX;
      const y = e.offsetY;
      ctx.globalCompositeOperation = "destination-out";

      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fill();

      ctx.lineWidth = 30;
      ctx.beginPath();
      ctx.moveTo(old.x, old.y);
      ctx.lineTo(x, y);
      ctx.stroke();

      old = { x: x, y: y };
    }
  };
  const eraserUp = () => {
    isPress = false;
  };

  // setup eraser checkbox
  const eraserCheckbox = document.getElementById("eraser");

  eraserCheckbox.addEventListener("change", () => {
    if (eraserCheckbox.checked) {
      canvas.addEventListener("mousedown", eraserDown);
      canvas.addEventListener("mousemove", eraserMove);
      canvas.addEventListener("mouseup", eraserUp);
    } else {
      canvas.removeEventListener("mousedown", eraserDown);
      canvas.removeEventListener("mousemove", eraserMove);
      canvas.removeEventListener("mouseup", eraserUp);
      ctx.globalCompositeOperation = "source-over";
      setColor[color];
    }
  });
}
