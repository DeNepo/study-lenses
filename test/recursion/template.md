# A Recursion

Given:
```
past in recursive definition
```
---

## Functionified

```js
function r( ... ) {
  if ( ... ) {
    return ... ;
  } else {
    return ... ;
  };
};
```

[TOP](#a-recursion)

---

## Test Cases

build these by a combination of hand-solving, guessing, and trial/error.
validate them by running them through your recursive function. in later steps, the test cases will be right.  For now the function always is.


your definition will say what arguments are valid. be sure to follow what it recommends or you will spend a lot of time in endless loops

```
past in recursive definition
```

```js
test_cases = [
    {name: '', args: [], expected: null},
  ];
run_test(r, test_cases);
```

[TOP](#a-recursion)

---

## Formal Replacement

learning to work with formal definitions, and to trust recursive calls by stopping at 'faith cases'.

start by picking your favorite test case and see what happens as you move slowly away from it

```
past in recursive definition
```

template:
```js
{ console.log('%c\t   r(x) === y ', 'font-weight:bold');
  const expected = null;
  const vis = {};
  vis._0=()=>  null ;     
  vis._1=()=>  null ;
  vis._2=()=>  null ;
  vis._3=()=>  null ;
  vis._4=()=>  null ;
  vis._5=()=>  null ;
  render_vis(vis, expected);
}
```

[TOP](#a-recursion)
 
---

## Expanded Function

expand your original function so only one operation takes place on each line.  identify with variable names what role each operation is playing in the recursive solution

```
paste recursive definition here
```

```js
{ // console.log('expanded function')
  function spandy( ... ) {
    const is_base = ... ;
    if (is_base) {
      const turnt = ... ;
      return turnt;
    } else {
      const broke_a = ... ;
      const broke_b = ... ;
      const recursed = spandy( ... );
      const built = ... ;
      return built;
    };
  };
  console.log(spandy.toString());
  run_tests(spandy, test_cases);
};
```

[TOP](#a-recursion)

---

## Trusting Recursion

after you have understood the way your recursive solution branches through it's problem space it's important to shift and start thinking of your coded solution locally, reasoning locally about only one call at a time without trying to imagine the whole solution building up in pieces.  You must learn to trust the recursive call

this exercise will force you to manually solve several recursive calls, thinking locally about how each step evaluates _in this single call_.  when you reach the recursive call, you will call the original function you wrote up top.  

If any of these exercises fail the test case, you know it happened at one of your manual steps.  You'll have to practice debugging with one single call in mind, and your confidence with recursive programming will grow

```
paste recursive definition here
```

values used: 
```js
{ let result;                        
  const is_base = hardcode value;     // ... original operation
  if (is_base) {
    const turnt = ... ;               // ...
    result = turnt;
  } else {
    const broke_a = ... ;             // ... 
    const broke_b = ... ;             // ...
    const recursed = r( ... );        // r( ... )
    const built = ... ;               // ...
    result = built;
  };
  console.assert(result === r( ... ), 'r( ... ) !== '+result);
};
```


[TOP](#a-recursion)

---


## Logged Function

learn how to log your recursive functions.  this will be invaluable for debugging and for understanding the behavior of complex recursive solutions.

```
paste formal definition here
```

```js
{ // console.log('logged function');
  function logged( ... ) {                const log = {'0. args':[ ... ]};
    const is_base = ... ;                 log['1. base'] = ... ;
    if (is_base) {
      const turnt = ... ;                 log['2. turn'] = ... ;
      return {result:turnt, log};
    } else {
      const broke_a = ... ;               log['2. broke a'] = ... ;    
      const broke_b = ... ;               log['2. broke b'] = ... ;
      const recursed = logged( ... );
                                          log['3. recurse'] = recursed;
      const recurse_val = recursed.result;                                  
      const built = ... ;                 log['4. built'] = ... ;
      return {result:built, log} ;
    };
  };
  log_reports(logged, test_cases)
};
```


[TOP](#a-recursion)

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
[TOP](#a-recursion)

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
[TOP](#a-recursion)

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

[TOP](#a-recursion)
___
___
### <a href="http://janke-learning.org" target="_blank"><img src="https://user-images.githubusercontent.com/18554853/50098409-22575780-021c-11e9-99e1-962787adaded.png" width="40" height="40"></img> Janke Learning</a>
s
