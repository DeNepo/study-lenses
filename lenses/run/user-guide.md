# ?run

- `?run` - serves an HTML document that loads the file as a script
- `?run=module` - serves an HTML document that loads the file as a script with `type="module"`
- `?run=debug` - like before, but with a debugger statement before executing your script
- `?run=test` - creates a testing environment before loading your scripts, happens by default for `.spec.js` and `.test.js` files

the options can be combined: `?run=module+debug`, `?run=test+module`, ...
