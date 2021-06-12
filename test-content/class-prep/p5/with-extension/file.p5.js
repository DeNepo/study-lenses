let a = 0;

function setup() {
  background(0);
  noStroke();
  fill(102);
}

function draw() {
  const nextA = a++;
  const nextWidth = nextA % width;
  rect(nextWidth, 10, 2, 80);
}
