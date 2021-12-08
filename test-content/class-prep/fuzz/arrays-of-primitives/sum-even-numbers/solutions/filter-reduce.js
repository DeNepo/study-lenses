export const filterReduce = (arr) =>
  arr
    .reverse()
    .filter(e=>e) // keep the even numbers
    .reduce(e=>e); // add all the even numbers
