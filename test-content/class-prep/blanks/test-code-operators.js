// pass - AssignmentExpression
var a = 1;
let b = 2;
const c = 3;

a = 4;
b = 5;
(a = 6), (b = 7);

a += 1;
a -= 1;
// a ||= 1;
// a ??= 1;

// pass - AssignmentPattern
function a(x = 1) {}
// https://github.com/estree/estree/issues/3#issuecomment-75364627
function a(
  { a, b = 3, c: d = 4, j: { k } = { k: 1 }, [0]: x = -1 },
  [e /*elided*/, , f = 5, ...g] = 0,
  h,
  ...i
) {}

// pass - BinaryExpression
1 + 1;
1 - 1;
1 | 1;
1 * 1;
1 > 1;
1 <= 1;
1 === 1;
"e" in {};
1 instanceof Number;

// pass - ConditionalExpression
a ? b : c;
a === a ? b in {} : !c;
a ? b : a ? b : c ? b : a ? b : c;

// pass - LogicalExpression
a && b;
a || b;

// pass - TemplateLiteral
//  for now, leaving template in place
`${a && b}`;
`asdf ${a && b}`;
`${a && b} asdf`;
`asdf ${a && b} asdf`;

`${a && b}${c + 3 == 2}`;
`asdf ${a && b} asdf ${c + 3 == 2} asdf`;

// pass - UnaryExpression
!a;
+a;
-a;
~a;
typeof a;
void a;
delete window.a;

// pass - UpdateExpression
++a;
a++;
--a;
a--;

// pass - VariableDeclarator
var a2 = 1;
let b2 = 2;
const c2 = 3;

var a3 = 1,
  a33 = 1;
let b3 = 2,
  b33 = 1;
const c3 = 3,
  c33 = 1;

// pass - RestElement
const funk = (...asdf) => {};
function funky(...asdf) {}
const funkiest = function (...asdf) {};

// pass - SpreadElement
const x = [...[1, 2, 3]];
funk(...x);
const y = { ...{ a: 1, b: 2 } };
