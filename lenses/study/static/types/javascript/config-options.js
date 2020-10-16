// for reference
const config = {
  "eval": true, // renders "console" and "debugger" buttons
  "loopGuard": false, // present / not present
  "loopGuard": { // more precise configuration
    "active": true,
    "max": 0
  },
  "clearScheduled": false, // for setTimeout & setInterval
  "openIn": [
    "jsTutor",
    "loupe",
    "promisees",
    "esprima",
    "babel"
  ],
  "flowchart": false,
  "tests": false, // loads describe-it & chai
  "dependencies": [],
  // "aran": false,
};

module.exports = Object.assign({}, staticConfig, config);
