This lens is for studying files of source code in more detail. Depending on the type of file and the repository configurations, there may be more options.  You can find these options by hovering over `>> options <<` in the upper left.  All file types will have these options:

- Edit the code
- Save changes
- Reset the code
- Create a parsons problem from selected code

JavaScript files will have these extra options. Careful! Not all options are useful for all JavaScript files, it will take some experimentation to figure out the best ways for you to study different code.

- __Loop Guard__: inject loop guards into your code before evaluating.  This can help avoid the frustration of infinite loops
- __Flowchart__: generate a [flowchart](https://github.com/Bogdan-Lyashenko/js-code-to-svg-flowchart) from your code. These flowcharts are not perfect, and invalid JS code will not create a flowchart.
- __Clear Scheduled__: helpful for exercises that use `setTimeout` and `setInterval`.  clicking this button will clear all scheduled tasks
- __Eval__: evaluate your code in your DevTools' _console_ or _debugger_.  This will only work for code that is written to run in the browser as a single file.
  - [Developer Console](https://javascript.info/devtools)
  - [Debugging in Chrome](https://javascript.info/debugging-chrome)
    - [breakpoints](https://developers.google.com/web/tools/chrome-devtools/javascript/reference)
  - [Errors & Debugging](https://education.launchcode.org/intro-to-professional-web-dev/chapters/errors-and-debugging/index.html)
- __Open In ...__: Open your code in one of several online visualization tools, including:
  - [JS Tutor](http://www.pythontutor.com/live.html#mode=edit): visualizes program memory with step-by-step evaluation
  - [Promisees](https://bevacqua.github.io/promisees/): visualize Promises and `async`/`await`
  - [Loupe](http://latentflip.com/loupe/?code=!!!): visualize the Event Loop (this tool rejects most ES6 code and does not visualize promises)
  - [Esprima](https://esprima.org/demo/parse.html?): take a deeper look into wh
