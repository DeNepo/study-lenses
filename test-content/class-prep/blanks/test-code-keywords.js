// pass - AwaitExpression
async function a() {
  await 2;
}

// pass - BreakStatement
while (false) {
  break;
}
z: while (false) {
  break z;
}

// pass - ClassDeclaration
class E {}
const e = class E {};

class E2 extends HTMLElement {}
const e2 = class E extends HTMLElement {};

// pass - ClassExpression
const f = class {};
const f12 = class extends HTMLElement {};

// - ContinueStatement
while (false) {
  continue;
}
y: while (false) {
  continue y;
}

// pass - DebuggerStatement
debugger;

// pass - DoWhileStatement
do {
  xyz;
} while (false === true);

// pass - ForInStatement
for (const a in {}) {
}
for (a in {}) {
}
for (const a in {});

// pass - ForOfStatement
for (const a of []) {
}
for (a of []) {
}
for (const a of []);

// pass - ForStatement
for (let i = 0; i < 1; i++) {}
for (let i = 0; i < 1; i++);
// for (;;);

// pass - FunctionDeclaration
{
  function x1() {}
  function* x2() {}
}
{
  function x1(a) {}
  function* x2(a) {}
}
{
  function x1(a = 1) {}
  function* x2(a = 1) {}
}
{
  function x1(...a) {}
  function* x2(...a) {}
}

// pass - FunctionExpression
{
  const p1 = function () {};
  const p2 = function* () {};

  const q1 = function Q() {};
  const q2 = function* Q() {};
}
{
  const p1 = function (a) {};
  const p2 = function* (a) {};

  const q1 = function Q(a) {};
  const q2 = function* Q(a) {};
}
{
  const p1 = function (a = 1) {};
  const p2 = function* (a = 1) {};

  const q1 = function Q(a = 1) {};
  const q2 = function* Q(a = 1) {};
}
{
  const p1 = function (...a) {};
  const p2 = function* (...a) {};

  const q1 = function Q(...a) {};
  const q2 = function* Q(...a) {};
}

// pass - IfStatement
if (true === false);
if (true === false) null;
if (true === false) {
}
if (true === false) {
} else {
}

if (true === false) {
} else if (true === false);
if (true === false) {
} else if (true === false) null;
if (true === false) {
} else if (true === false) {
}
if (true === false) {
} else if (true === false) {
} else {
}

if (true) {
  if (true) {
  }
}

// pass - NewExpression
new Date();
new Date(123);
const d1 = new Date();
const d2 = new Date(123);

// pass - ReturnStatement
function f1() {
  return 1 + 1;
  return;
}
const f2 = function () {
  return 1 + 1;
  return;
};
const f3 = () => {
  return 1 + 1;
  return;
};
const f4 = function* () {
  return 1 + 1;
  return;
};
// ...

// pass - Super
class I extends HTMLElement {
  constructor() {
    super(3 - 2);
  }
}

// fail - SwitchCase & SwitchStatement
/*
  formatting is a mess
  but not priority, it's not taught in course
*/
switch (expr) {
  case 'Oranges':
    break;
    null;
  case 'Mangoes':
    switch (expr) {
      case 'Oranges':
        break;
        null;
      case 'Mangoes':
      default:
        null;
    }
  default:
    null;
}
if (true) {
  switch (expr) {
    case 'Oranges':
      break;
      null;
    case 'Mangoes':
    default:
      null;
  }
}

// pass - ThisExpression
function t() {
  this.t;
}
const tObj = {
  t() {
    this();
  },
};
class T {
  constructor() {
    this;
  }
}

// pass - ThrowStatement
throw 1;
throw 1 + 2;
throw new Error();

// pass - TryStatement & CatchClause
try {
  null;
} catch (err) {}

try {
  null;
} finally {
}

try {
  null;
} catch (err) {
} finally {
}

// pass - VariableDeclaration
//  multiple declarations are multiple declarators
//  doesn't impact the VariableDeclaration

var o1;
let o2;
var o3 = 1;
let o4 = 1;
const o5 = 1;

// pass - WhileStatement
while (false);
while (false) {
  break;
}
r: while (false) {
  break;
}

// pass - WithStatement
with (_);
with (_) {
}

// - YieldExpression
function* u1() {
  yield;
  yield 1;
}
const u2 = function* u() {
  yield 1;
};
