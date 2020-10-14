

# Recursion

recursion is one of the main gateways into abstraction and true computer science.  Because it is important, powerful, and radically different from what you have experienced before it's important to take some time to become comfortable analyzing and working with recursive code before trying to write your own recursive solutions.

At it's simplest definition, a recursive function is any function that calls itself.

But this doesn't get us very far in understanding how to practically write or work with recursive code.  Luckily, meaningful recursive code almost all follows the same general pattern.  These exercises will focus on understanding the basic structure of recursive solutions.  Later exercises will cover how to identify when recursion is an appropriate strategy and on how to design recursive solutions from the bottom up.  But first you must be confident logging, decomposing and debugging recursive functions.

### Index
* [recursion?](#recursion)
* [recursive definitions](#recursive-definitions)
* [recursive functions](#recursive-functions)
* [expanding recursion](#expanding-recursion)
* [how to do the exercises](#how-to-do-the-exercises)
* examples to study
    * [example 1](./example-1.md)
    * [example 1](./example-1.md)
* [recursive starters](#recursive-starters)
* [helper functions](#helper-functions)

---

## recursion?

This won't be as hard to learn as you might have hears, but analogies and practical problems will get in the way of truly learning recursion. the trick with recursion is to turn off your 'intuition' & 'visualization' for a while while in order to build a solid understanding from scratch.

In this series of exercises you will learn to build your understanding of recursion from the ground up by practicing working from the purely mathematical definition of a recursive function while gradually integrating your practical understanding of how code can implement these abstract definitions.

[TOP](#recursion)

---

## Recursive Definitions

don't be afraid!  of all the formulas in computer science, recursive definitions are actually one of the simplest and most approachable.  let's take a look at one to understand the standard pieces of a recursive function:

```
{n | n is a whole number > 0}
r(n) === n / 2            :: if (n === 1)
r(n) === r(n-1) + r(n-1)  :: if (n > 1)
```

There are 6 pieces to any basic recursive definition
0. _the set_: what arguments is this function designed to take? (anything else will almost certainly lead to an infinite recursion)
    * __{n | n is a whole number > 0}__ : calling this recursive function with an argument that isn't a whole number (1, 2, 3, ...) greater than 0 will cause your stack to overflow
1. _the base case_: when to stop recursing and start returning?
    * __if (n === 1)__ : this recursive function's base case is when it's argument === 1.  if you call it with 1 as your argument, it will immediately return without recursing
2. _the turn-around_: what to do to the base-case argument before returning it?
    * __n / 2__ : in this function, the turn-around is to divide the argument by 2.  Whenever you call it with 1, it will return .5
3. _the break-down_: how do you move arguments incrementally closer to the base-case?
    * __n-1__ : all arguments are numbers greater than 0, and 1 is our base-case. So it makes sense that subtracting 1 is a fail-proof way to move closer to the base-case without passing it and entering endless recursion.
4. _the recursion_: the function calls itself with new arguments one step closer to the base-case
    * __r(n-1)__ : in this function, there are actually two recursive calls made with the same broken-down argument, each one is a separate function call and should be thought of as two distinct steps.
5. _the build-up_: what happens to the recursion's return value that brings it one step closer to a full solution? this will also be the return value for non-base-case arguments
    * __+__ : here the function simply adds together the results from both recursive calls and returns the sum

[TOP](#recursion)

---

## Recursive Functions

going from a recursive definition to a recursive function is actually very simple, it's essentially just some copy-pasting:

definition:
```
{n | n is a whole number > 0}
r(n) === n / 2            :: if (n === 1)
r(n) === r(n-1) + r(n-1)  :: if (n > 1)
```
function:
```js
function r(n) {
  if (n === 1) {
    return n / 2;
  } else {
    return r(n-1) + r(n-1);
  };
};
```

[TOP](#recursion)

---

## Expanding Recursion

expanding recursive functions into it's component steps is a relatively simple skill that will help enormously with building, debugging, and understanding recursive code:

function:
```js
function r(n) {
  if (n === 1) {
    return n / 2;
  } else {
    return r(n-1) + r(n-1);
  };
};
```

expanded:
```js
function r(n) {
  const is_base = n === 1;
  if (is_base) {
    const turnt = n / 2;
    return turnt;
  } else {
    const brokn = n - 1;
    const rec_l = r(brokn);
    const rec_r = r(brokn);
    const built = rec_l + rec_r;
    return built;
  };
};
```


[TOP](#recursion)

---


## How to do the exercises

1. fork this repo.  you'll study our starter material and keep your own notes on your fork
2. study the examples to see what it's all about.
    * [example 1](./example-1.md)
    * [example 1](./example-1.md)
3. create a new markdown file in your fork of this repository & copy-paste the contents of [template.md](./template.md) into this new file.
4. copy-paste one of the recursive starters into the top of your new empty file
5. set up your study environment: copy all the [helper functions](#helper-functions) to the console and hit enter so they're around for later. (they are also available at the bottom of the template)
6. learn away!

Still looking for more? come up with random recursive definitions and see how they behave

[TOP](#recursion)

---

## recursive starters

each challenge defines it's set of arguments. be sure to follow the recommendations or you will spend a lot of time in endless loops

1.
```
for a > 0, b < 0. a & b are whole numbers
r(a,b) === a + b        :: b > a
r(a,b) === r(a-1, b+1)  :: else
```

2.
```
for a > 0, b > 0. a & b are whole numbers
r(a,b) === a * b        :: b === 1 || a === 1
r(a,b) === r(b, a-1)    :: else
```

3.
```
{a | a is a whole number}
r(a) === (a - 2) / 3    :: (a - 2) % 3 === 0
r(a) === r(a + 5)       :: else
```

4.
```
{ a | a is a string }
r(a) === a                                    :: a.length === 1 || a.length === 0
r(a) === r( a.slice(a.length/2, a.length) )
         + r( a.slice(0, a.length/2) )        :: else
```

5.
```
{ a | a is a string }
r(a,b) === a + b                              :: a.length === 1 || b.length == 1
r(a,b) === r( a.slice(0, a.length/2) , b.slice(0, b.length/2) )
           + r( a.slice(a.length/2, a.length), b.slice(b.length/2, b.length) )
                                              :: else
```


[TOP](#recursion)

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
[TOP](#recusion-exercises)

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
[TOP](#recusion-exercises)

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

[TOP](#recusion-exercises)
___
___
### <a href="http://janke-learning.org" target="_blank"><img src="https://user-images.githubusercontent.com/18554853/50098409-22575780-021c-11e9-99e1-962787adaded.png" width="40" height="40"></img> Janke Learning</a>

