/* this will be for
  configuring what to ask questions about

  tbd
    how to cross-section concepts for questioning
    what nodes are for what questions
*/
export const config = {
  openEnded: {
    controlFlow: { ask: true },
    data: { ask: true },
    functions: { ask: true },
    operators: { ask: true },
    variables: { ask: true },
    traces: { ask: true },
    generic: { ask: true },
    levels: [1, 2, 3, 4, 5],
    alert: { ask: false },
    range: { start: 0, end: 0 },
  },
  multipleChoice: {
    types: [],
  },
};
