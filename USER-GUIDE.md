# Study Lenses

To understand what's going on here the first thing to know is that you are using
a _static server_, like the `liveServer` extension for Visual Studio Code. This
means you can use `$ study` to develop your HTML/CSS/JavaScript projects as you
normally would. You'll just have to refresh manually when you make changes.

The differences begin when you start adding URL Query Parameters
(<a href="https://www.youtube.com/watch?v=WIUrrp5KkCo" target="_blank">Thomas</a>,
<a href="https://en.wikipedia.org/wiki/Query_string" target="_blank">wikipedia</a>).
This server supports a few custom query parameters called _lenses_ because they
help you see and study your code in new ways. You can add parameters to your URL
by writing them directly in
<a href="https://en.wikipedia.org/wiki/Address_bar" target="_blank">address
bar</a> and refreshing.

> PS. The links with a `?` in this file will only work properly when you are
> reading this in Study Lenses

---

## Files

You can study different files in different ways. Here are some examples you can
try out to get the feel:

<details>
<summary><strong>JavaScript</strong></summary>
<br>

- <a href="./study_lenses_public/smiley.js" target="_blank">/smiley.js</a> - get
  the source code for a .js file
- <a href="./study_lenses_public/smiley.js?study" target="_blank">/smiley.js?study</a> -
  study it as a live exercise in the debugger
- <a href="./study_lenses_public/smiley.js?parsons" target="_blank">/smiley.js?parsons</a> -
  or a parsons problem
- <a href="./study_lenses_public/smiley.js?flowchart" target="_blank">/smiley.js?flowchart</a> -
  or a flowchart
- <a href="./study_lenses_public/smiley.js?highlight" target="_blank">/smiley.js?highlight</a> -
  or highlighted source
- <a href="./study_lenses_public/smiley.js?variables" target="_blank">/smiley.js?variables</a> -
  or highlight the variables
- <a href="./study_lenses_public/smiley.js?blanks" target="_blank">/smiley.js?blanks</a> -
  or a fill-in-the-blank exercise
- <a href="./study_lenses_public/smiley.js?pseudo&highlight" target="_blank">/smiley.js?pseudo&highlight</a> -
  or convert the code to pseudocode

</details>

<details>
<summary><strong>Markdown</strong></summary>
<br>

- <a href="./study_lenses_public/README.md" target="_blank"><code>/README.md</code></a> -
  get the source code for a markdown file
- <a href="./study_lenses_public/README.md?highlight" target="_blank"><code>/README.md?highlight</code></a> -
  or highlight it
- <a href="./study_lenses_public/README.md?render" target="_blank"><code>/README.md?render</code></a> -
  or render it into a web page
- <a href="./study_lenses_public/README.md?study" target="_blank"><code>/README.md?study</code></a> -
  or study it (JS code blocks will have lens buttons)
- <a href="./study_lenses_public/README.md?slides" target="_blank"><code>/README.md?slides</code></a> -
  each divider (`---`) will be a new slide

</details>

<details>
<summary><strong>HTML</strong></summary>

- <a href="./study_lenses_public/index.html" target="_blank"><code>/index.html</code></a> -
  open an HTML file without parameters ... and it's a website
- <a href="./study_lenses_public/index.html?highlight" target="_blank"><code>/index.html?highlight</code></a> -
  highlight the source code
- <a href="./study_lenses_public/index.html?study" target="_blank"><code>/index.html?study</code></a> -
  try out some changes in real-time

</details>

---

## Directories

Besides single files, you can also add lenses to view entire directories.

- <a href="./?study" target="_blank">./?study</a> - view it as a navigable
  directory structure with each file using the default lenses. if there is a
  README, it will be rendered underneath the directory contents.
- <a href="./?json-explorer" target="_blank">./?json-explorer</a> - or examine
  the virtual directory as a JSON object

If you navigate to a directory without adding any parameters, what you see will
depend on what files are in the directory:

- if there is an `index.html`, that will be served as a web page
- if there is a `README.md` and no `index.html`, then the README will be
  rendered and served as a web page
- if there is no `index.html` or `README.md`, you will get a _404_ error

<!-- weakly supported: SUMMARY.md for rendering gitbook content locally -->

---

## Sandboxes

Study Lenses also has a few sandbox environments for working with throw-away
examples. You can open a sandbox from any URL with the `?--sandbox` option but
you can't save your work:

- JavaScript Editor: <a href="./?--js" target="_blank"><code>?--js</code></a>
- JavaScript Repl: <a href="./?--repl" target="_blank"><code>?--repl</code></a>
- HTML: <a href="./?--html" target="_blank"><code>?--html</code></a>
- Whiteboard: <a href="./?--draw" target="_blank"><code>/?--draw</code></a>
- p5.js: <a href="./?--p5" target="_blank"><code>?--p5</code></a>
- Logo: <a href="./?--logo" target="_blank"><code>?--logo</code></a>
- [Dirty Turtle](https://github.com/kredati/dirty-turtle):
  <a href="./?--turtle" target="_blank"><code>?--turtle</code></a>

---

## Lenses

Different ways you can view the same resource

<!-- BEGIN LENSES -->
<!-- END LENSES -->

---

## Options

Ways to modify the server's behavior, kind of like CLI options

<!-- BEGIN OPTIONS -->
<!-- END OPTIONS -->

---

![Panda Smash](./study_lenses_public/panda-smash.gif)
