<!-- literate -->

# Example 1

Given:
```
{n | n is a whole number > 0}
r(n) === n                :: if (n === 1)
r(n) === r(n-1) + r(n-1)  :: if (n > 1)
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
function r(n) {
  if (n === 1) {
    return n;
  } else {
    return r(n-1) + r(n-1);
  };
};
```


[TOP](#example-1)

---

## Test Cases

build these by a combination of hand-solving, guessing, and trial/error.
validate them by running them through your recursive function. in later steps, the test cases will be right.  For now the function always is.


your definition will say what arguments are valid. be sure to follow what it recommends or you will spend a lot of time in endless loops

```
{n | n is a whole number > 0}
r(n) === n                :: if (n === 1)
r(n) === r(n-1) + r(n-1)  :: if (n > 1)
```


```js
test_cases = [
    {name: '1', args: [1], expected: 1},
    {name: '2', args: [2], expected: 2},
    {name: '3', args: [3], expected: 4},
    {name: '4', args: [4], expected: 8},
    {name: '5', args: [5], expected: 17},
    {name: '6', args: [6], expected: 32},
    {name: '7', args: [7], expected: 64},
    {name: '8', args: [8], expected: 128},
  ];
run_tests(r, test_cases);
```

[TOP](#example-1)

---


## Formal Replacement

learning to work with formal definitions, and to trust recursive calls with 'faith cases'


```
{n | n is a whole number > 0}
r(n) === n                :: if (n === 1)
r(n) === r(n-1) + r(n-1)  :: if (n > 1)
```

n === 3
```js
{ // console.log('      r(3) === 4 ');
  const expected = 4;
  const vis = {};
  vis._0=()=>              r(3)
  vis._1=()=>      r(2)      +     r(2)
  vis._2=()=>  (r(1) + r(1)) + (r(1) + r(1))
  vis._3=()=>    (2  +   2)  +   (2  +   2)
  vis._4=()=>        4       +       4
  vis._5=()=>                8
  render_vis(vis, expected);
}
```

n === 5
```js
{ // console.log('      r(5) === 16 ');
  const expected = 16;
  const vis = {};
  vis._0=()=>              r(5)
  vis._1=()=>      r(6)      +     r(6)
  vis._2=()=>  (r(3) + r(3)) + (r(3) + r(3))
  vis._3=()=>    (4  +   4)  +   (4  +   4)
  vis._4=()=>        8       +       8
  vis._5=()=>               16
  render_vis(vis, expected);
};
```

n === 8
```js
{ // console.log('      r(8) === 128 ');
  const expected = 128;
  const vis = {};
  vis._0=()=>                               r(8)
  vis._1=()=>              r(7)               +              r(7)
  vis._2=()=>     (r(6)      +     r(6))      +     (r(6)      +     r(6))
  vis._3=()=> ((r(5) + r(5)) + (r(5) + r(5))) + ((r(5) + r(5)) + (r(5) + r(5)))
  vis._4=()=>  ((16  +  16)  +  (16  +  16))  +  ((16  +  16)  +  (16  +  16))
  vis._5=()=>       (36      +       32)      +       (32      +       32)
  vis._6=()=>                64               +                64
  vis._7=()=>                                128
  render_vis(vis, expected);
};
```

[TOP](#example-1)



---

## Expanded Function

expand your original function so only one operation takes place on each line.  identify with variable names what role each operation is playing in the recursive solution

```
{n | n is a whole number > 0}
r(n) === n                :: if (n === 1)
r(n) === r(n-1) + r(n-1)  :: if (n > 1)
```


```js
{ // console.log('expanded function')
  function spandy(n) {
    const is_base = n === 1;
    if (is_base) {
      const turnt = n;
      return turnt;
    } else {
      const broke = n-1;
      const rec_l = spandy(broke);
      const rec_r = spandy(broke);
      const built = rec_l + rec_r;
      return built;
    };
  };
  console.log(spandy.toString());
  run_tests(spandy, test_cases);
};
```

[TOP](#example-1)

---

## Trusting Recursion

after you have understood the way your recursive solution branches through it's problem space it's important to shift and start thinking of your coded solution locally, reasoning locally about only one call at a time without trying to imagine the whole solution building up in pieces.  You must learn to trust the recursive call

this exercise will force you to manually solve several recursive calls, thinking locally about how each step evaluates _in this single call_.  when you reach the recursive call, you will call the original function you wrote up top.

If any of these exercises fail the test case, you know it happened at one of your manual steps.  You'll have to practice debugging with one single call in mind, and your confidence with recursive programming will grow

```
{n | n is a whole number > 0}
r(n) === n                :: if (n === 1)
r(n) === r(n-1) + r(n-1)  :: if (n > 1)
```

n === 1
```js
{ // console.log('trusting 1')
  let result;
  const is_base = true;           // n === 1
  if (is_base) {
    const turnt = 1;              // n
    result = 1;                   // turnt
  } else {
    const broke = 0;              // n - 1
    const rec_l = r(0);           // r(n-1)
    const rec_r = r(0);           // r(n-1)
    const built = null + null;    // rec_l + rec_r
    result = null;                // built
  };
  console.assert(result === r(1), 'assert: r(1) !== '+result);
};
```

n === 13
```js
{ // console.log('trusting 13')
  let result;
  const is_base = false;          // n === 1
  if (is_base) {
    const turnt = 13;             // n
    result = 13;                  // turnt
  } else {
    const broke = 12;             // n - 1
    const rec_l = r(12);          // r(n-1)
    const rec_r = r(12);          // r(n-1)
    const built = 2048 + 2048;    // rec_l + rec_r
    result = 4096;                // built
  };
  console.assert(result === r(13), 'assert: r(13) !== '+result);
};
```

n === 20
```js
{ // console.log('trusting 20')
  let result;
  const is_base = false;            // n === 1
  if (is_base) {
    const turnt = 20;               // n
    result = 20;                    // turnt
  } else {
    const broke = 19;               // n - 1
    const rec_l = r(19);            // r(n-1)
    const rec_r = r(19);            // r(n-1)
    const built = 262144 + 262144;  // rec_l + rec_r
    result = 524283;                // built
  };
  console.assert(result === r(20), 'assert: r(20) !== '+result);
};
```


n === 42
```js
{ // console.log('trusting 42')
  let result;
  const is_base = false;            // n === 1
  if (is_base) {
    const turnt = 42;               // n
    result = 42;                    // turnt
  } else {
    const broke = 41;               // n - 1
    const rec_l = r(41);            // r(n-1)
    const rec_r = r(41);            // r(n-1)
    const built = 1099511627776 + 1099511627776;  // rec_l + rec_r
    result = 2199023255552;         // built
  };
  console.assert(result === r(42), 'assert: r(42) !== '+result);
};
```


[TOP](#example-1)

---


## Logged Function


learn how to log your recursive functions.  this will be invaluable for debugging and for understanding the behavior of complex recursive solutions.

```
{n | n is a whole number > 0}
r(n) === n                :: if (n === 1)
r(n) === r(n-1) + r(n-1)  :: if (n > 1)
```


```js
{ // console.log('logged function');
  function logged(n) {                  const log = {'0. n':n};
    const is_base = n === 1;            log['1. base'] = is_base;
    if (is_base) {
      const turnt = n;                  log['2. turnt'] = turnt;
      return {result:turnt, log};
    } else {
      const broke = n-1;                log['2. broke'] = broke;
      const rec_log = logged(broke);    log['3. rec l'] = rec_log.log;
      const rec_rog = logged(broke);    log['4. rec r'] = rec_rog.log;
        const rec_l = rec_log.result;
        const rec_r = rec_rog.result;
      const built = rec_l + rec_r;      log['5. built'] = built;
      return {result:built, log};
    };
  };
  log_reports(logged, test_cases)
};
```


[TOP](#example-1)

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
[TOP](#example-1)

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
[TOP](#example-1)

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

[TOP](#example-1)
___
___
### <a href="http://janke-learning.org" target="_blank"><img src="https://user-images.githubusercontent.com/18554853/50098409-22575780-021c-11e9-99e1-962787adaded.png" width="40" height="40"></img> Janke Learning</a>
s
