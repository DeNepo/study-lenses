// const clearScheduledFactory = () => {
//   // timeout & interval share a pool of ids
//   // clearTimeout will also clear intervals, and vice-versa
//   // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout#Return_value

//   let minId = setTimeout(() => {}, 0);

//   return () => {
//     const maxId = setTimeout(() => {}, 0);
//     for (let i = minId; i < maxId; i++) {
//       clearInterval(i);
//     }
//     minId = maxId + 1;
//   };
// };

const clearScheduledFactory = () => () => document.body.removeChild(evaller);
