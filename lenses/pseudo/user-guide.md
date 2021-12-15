## `?pseudo`

This lens takes a JavaScript file and converts it into PseudoCode you can draw on.

It will follow these rules when translating to pseudo code:

- These things will be removed from the code:
  - `console` calls
  - `debugger` statements
  - `'use strict'`
  - `let`, `const` and `var`
  - comments
- variable declarations that are not initialized will be removed
- The assignment operator will be replaced by `<-`
  - this symbol more clearly shows the semantics of variable assignment
- Arrow functions with a body are represented the same way as `function` functions
- Arrow functions with an implicit return are left as arrow functions
- All other operators will be unchanged
- Key words will be set to UPPERCASE
- Arrow functions with a body will be converted to function expressions
- All control flow statements & functions will have `END TYPE` instead of closing brackets
- A new line will be placed between every top level line of the code

Anything not listed will be unchanged.
