const checkPoint = 3;
let i = 0;
while (i < 6) {
  if (i === checkPoint) {
    i = i + 2;
    continue;
  }
  i = i + 1;
  console.log(i);
}
