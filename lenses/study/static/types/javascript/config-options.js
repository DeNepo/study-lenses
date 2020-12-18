// for reference, not actually used
const config = {
  eval: true, // renders "console" and "debugger" buttons
  loopGuard: false, // present / not present
  loopGuard: {
    // more precise configuration
    active: true,
    max: 100,
  },
  clearScheduled: false, // for setTimeout & setInterval
  openIn: ["jsTutor", "loupe", "promisees"],
  flowchart: false,
  trace: false, // instrument and run code
  tests: false, // loads describe-it & chai
  ast: false, // editor/json-explore realtime ast the code
  dependencies: [],
  // "aran": false,
};
