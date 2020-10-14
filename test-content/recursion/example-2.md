<!-- literate -->

# Example 2

Given:
```
for all: a < 0, 0 < b, a and b are numbers
r(a,b) === a + b        :: a > b
r(a,b) === r(a+1, b-1)  :: !(a > b)
```

### index
* [functionified](#functionified)
* [test cases](#test-cases)
* [formal replacement](#formal-replacement)
* [expanded function](#expanded-function)
* [trusting recursion](#trusting-recursion)
* [logged function](#logged-function)
* [(helper functions)](#helper-functions)

---

## Functionified

```js
function r(a, b) {
  if (a > b) {
    return a + b;
  } else {
    return r(a+1, b-1)
  };
};
```


[TOP](#example-2)

---

## Test Cases

build these by a combination of hand-solving, guessing, and trial/error.
validate them by running them through your recursive function. in later steps, the test cases will be right.  For now the function always is.


your definition will say what arguments are valid. be sure to follow what it recommends or you will spend a lot of time in endless loops

Given:
```
for all: a < 0, 0 < b, a and b are numbers
r(a,b) === a + b        :: a > b
r(a,b) === r(a+1, b-1)  :: !(a > b)
```

```js
test_cases = [
    {name: '-2, 2', args: [-2, 2], expected: 0},
    {name: '-2, 5', args: [-2, 5], expected: 3},
    {name: '-5, 2', args: [-5, 2], expected: -3},
    {name: '-.5, .5', args: [-.5, .5], expected: 0},
    {name: '-100, 100', args: [-100, 100], expected: 0},
    {name: '-1, 100', args: [-1, 100], expected: 99},
    {name: '-100, 1', args: [-100, 1], expected: -99},
    {name: '-.005, .5', args: [-.005, .5], expected: .495},
    {name: '-.5, .005', args: [-.5, .005], expected: -.495},
  ];
run_tests(r, test_cases);
```

[TOP](#example-2)

---


## Formal Replacement

learning to work with formal definitions, and to trust recursive calls with 'faith cases'


```
for all: a < 0, 0 < b, a and b are numbers
r(a,b) === a + b        :: a > b
r(a,b) === r(a+1, b-1)  :: !(a > b)
```

n === 3
```js
{ // console.log('      r(-2, 2) === 0 ');
  const expected = 0;
  const vis = {};
  vis._0=()=>          r(-2, 2)
  vis._1=()=>          r(-1, 1)
  vis._2=()=>          r(0, 0)
  vis._3=()=>          r(1, -1)
  vis._4=()=>           -1 + 1
  vis._5=()=>              0
  render_vis(vis, expected);
}
```

n === 5
```js
{ // console.log('      r(-2, 5) === 3 ');
  const expected = 3;
  const vis = {};
  vis._0=()=>          r(-2, 5)
  vis._1=()=>          r(-1, 4)
  vis._2=()=>          r(0, 3)
  vis._3=()=>          r(1, 2)
  vis._4=()=>          r(2, 1)
  vis._5=()=>           2 + 1
  vis._6=()=>             3
  render_vis(vis, expected);
}
```

n === 8
```js
{ // console.log('      r(-5, 2) === -3 ');
  const expected = -3;
  const vis = {};
  vis._0=()=>          r(-5, 2)
  vis._1=()=>          r(-4, 1)
  vis._2=()=>          r(-3, 0)
  vis._3=()=>          r(-2, -1)
  vis._4=()=>          r(-1, -2)
  vis._5=()=>           -1 + -2
  vis._6=()=>             -3
  render_vis(vis, expected);
}
```

[TOP](#example-2)

---

## Expanded Function

expand your original function so only one operation takes place on each line.  identify with variable names what role each operation is playing in the recursive solution

```
for all: a < 0, 0 < b, a and b are numbers
r(a,b) === a + b        :: a > b
r(a,b) === r(a+1, b-1)  :: !(a > b)
```

```js
{ // console.log('expanded function')
  function spandy(a, b) {
    const is_base = a > b;
    if (is_base) {
      const turnt = a + b;
      return turnt;
    } else {
      const broke_a = a + 1;
      const broke_b = b - 1;
      const recursed = spandy(broke_a, broke_b);
      const built = recursed;
      return built;
    };
  };
  console.log(spandy.toString());
  run_tests(spandy, test_cases);
};
```

[TOP](#example-2)

---

## Trusting Recursion

after you have understood the way your recursive solution branches through it's problem space it's important to shift and start thinking of your coded solution locally, reasoning locally about only one call at a time without trying to imagine the whole solution building up in pieces.  You must learn to trust the recursive call

this exercise will force you to manually solve several recursive calls, thinking locally about how each step evaluates _in this single call_.  when you reach the recursive call, you will call the original function you wrote up top.

If any of these exercises fail the test case, you know it happened at one of your manual steps.  You'll have to practice debugging with one single call in mind, and your confidence with recursive programming will grow

```
for all: a < 0, 0 < b, a and b are numbers
r(a,b) === a + b        :: a > b
r(a,b) === r(a+1, b-1)  :: !(a > b)
```

a === -3, b === 70
```js
{ let result;
  const is_base = false;              // a > b
  if (is_base) {
    const turnt = 67;                 // a + b
    result = turnt;
  } else {
    const broke_a = -2;               // a + 1
    const broke_b = 69;               // b - 1
    const recursed = r(-2, 69);       // r(a+1, b-1)
    const built = 67;                 // recursed
    result = built;
  };
  console.assert(result === r(-3, 70), 'r(-3, 70) !== '+result);
};
```

a === 1000, b === -900
```js
{ let result;
  const is_base = true;               // a > b
  if (is_base) {
    const turnt = 100;                // a + b
    result = turnt;
  } else {
    const broke_a = 1001;             // a + 1
    const broke_b = -901;             // b - 1
    const recursed = r(1001, -901);   // r(a+1, b-1)
    const built = 100;                // recursed
    result = built;
  };
  console.assert(result === r(1000, -900), 'r(-1000, -900) !== '+result);
};
```
a === -70, b === 3
```js
{ let result;
  const is_base = false;              // a > b
  if (is_base) {
    const turnt = -67;                // a + b
    result = turnt;
  } else {
    const broke_a = -69;              // a + 1
    const broke_b = 2;                // b - 1
    const recursed = r(-69, 2);       // r(a+1, b-1)
    const built = -67;                // recursed
    result = built;
  };
  console.assert(result === r(-70, 3), 'r(-70, 3) !== '+result);
};
```



[TOP](#example-2)

---


## Logged Function

learn how to log your recursive functions.  this will be invaluable for debugging and for understanding the behavior of complex recursive solutions.


```
for all: a < 0, 0 < b, a and b are numbers
r(a,b) === a + b        :: a > b
r(a,b) === r(a+1, b-1)  :: !(a > b)
```

```js
{ // console.log('logged function');
  function logged(a,b) {                  const log = {'0. args':[a,b]};
    const is_base = a > b;                log['1. base'] = a > b;
    if (is_base) {
      const turnt = a + b;                log['2. turn'] = a + b;
      return {result:turnt, log};
    } else {
      const broke_a = a + 1;              log['2. broke a'] = a + 1;
      const broke_b = b - 1;              log['2. broke b'] = b - 1;
      const recursed = logged(broke_a, broke_b);
                                          log['3. recurse'] = recursed.log;
      const built = recursed.result;      log['4. built'] = recursed.result;
      return {result:built, log} ;
    };
  };
  log_reports(logged, test_cases)
};
```


[TOP](#example-2)

---
---

## Helper functions

* [run tests](#run-tests)
* [render vis](#render-vis)
* [log reports](#log-reports)


#### Run Tests

takes a function and array of test cases.
* if a case passes, nothing happens
* if it fails, the actual & expected values are logged

this helper is used to build the test cases against the recursive function and to test the expanded solution.

```js
function run_tests(_target, _cases) {
  for (let t_case of _cases) {

    // process user input (test cases)
    const expected = t_case.expected;
    const args = JSON.parse(JSON.stringify(t_case.args));

    // perform core logic (run test and assert)
    let actual = _target(...args);
    let pass;
    if (typeof expected === 'object') {
      const _actual = JSON.stringify(actual);
      const _expected = JSON.stringify(expected);
      pass = _actual === _expected;
    } else if ( typeof expected === 'number' && isNaN(expected) ) {
      pass = isNaN(actual) && typeof actual === 'number';
    } else {
      pass = actual === expected;
    };

    // communicate result to developer
    if (!pass) {
      console.groupCollapsed(`%c ${t_case.name}: \n`, 'color:orange');
      console.log(`%c   actual: ${typeof actual},`, 'color:red', actual);
      console.log(`%c   expected: ${typeof expected},`, 'color:blue', expected);
      console.groupEnd();
    };
  };
};
```
[TOP](#example-2)

#### Render Vis

takes in an object of functions with no args and an expected value.  it compares each function's return value to the expected value and prints the body of the function to the console.
* if a function fails, it prints the function in orange with actual & expected values logged below
* if it passes, it prints the function in green

it is used in the manual step-throughs

```js
function render_vis(_vis, _expected) {
  const keys = Object.keys(_vis);
  for (let i = 0; i < keys.length; i++) {
    const step = keys[i];
    const actual = _vis[step]();
    if (actual !== _expected) {
      console.groupCollapsed(`%c${i}:${_vis[step].toString()}`, 'color:orange');
      console.log(`%c   actual: ${typeof actual},`, 'color:red', actual);
      console.log(`%c   expected: ${typeof _expected},`, 'color:blue', _expected);
      console.groupEnd();
    } else {
      console.log(`%c${i}:${_vis[step].toString()}`, 'color:green');
    };
  };
};
```
[TOP](#example-2)

#### Log Reports

takes a logging function and test cases. It passes each test case through the function and prints out one log for each test case at the end.
* if a test passes, it prints the log as is
* if a test fails, it replaces 'result' with 'actual' and 'expected'

used in 'logged function'

```js
function log_reports(_target, _cases) {
  const report = {}
  for (let t_case of _cases) {
    const actual = _target(...t_case.args);
    if (actual.result !== t_case.expected) {
      const failog = {};
      failog.actual = actual.result;
      failog.expected = t_case.expected;
      failog.log = actual.log;
      report[t_case.name] = failog;
    } else {
      report[t_case.name] = actual;
    };
  };
  console.log(report)
};
```

[TOP](#example-2)
___
___
### <a href="http://janke-learning.org" target="_blank"><img src="https://user-images.githubusercontent.com/18554853/50098409-22575780-021c-11e9-99e1-962787adaded.png" width="40" height="40"></img> Janke Learning</a>

