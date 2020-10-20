let a = 0;
let loopGuard_2 = 0;
while (a < 4) {
  if (++loopGuard_2 > 10) {
    throw new RangeError("loopGuard_2 is greater than 10");
  }
  a = a + 1;
}
