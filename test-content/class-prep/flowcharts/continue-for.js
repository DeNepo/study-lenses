'use strict';

const checkPoint = 3;
for (let i = 0; i < 8; i++) {
  if (i === checkPoint) {
    continue;
  }
  console.log(i);
}
