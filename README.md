# Study Lenses

a cli app to open directories of code in the browser with varying types of interactivity.

## Getting Started

1. `git clone` the repo
2. `cd study-lenses` into repo
3. `npm install -g .` (install this repository as a global dependency)
4. study any directory or file
   - `study`: the whole directory
   - `study test`: the directory of test contet
   - `study package.json`: this repo's package.json
   - ...

## Lenses & URL Parameters

at it's base, this is just a static server.  requesting a path inside the folder you have `study`ed will send the raw text. however ...

URL params can be used to view the source through different lenses.  once you have test running try entering the path to a file, adding `?hello-world` to the end of the URL and refreshing.  You can find the source code for this lense in [./src/lenses/hello-world](./src/lenses/hello-world)

To see lenses in action, open the test directory as indicated in __Getting Started__ and try these different requests (all of these paths assume you are in `/test`):

- `/README.md`
  - `/README.md` - no lense, the markdown source is returned as-is
  - `/README.md?hello-world` - the markdown will be rendered into a textarea in an HTML file
  - `/README.md?hello-world=1234` - the markdown will be rendered into a textarea in an HTML file, with the value 1234 passed as a query
  - `/README.md?render` - the markdown will be rendered to HTML using marked, it will now be a web page
  - `/README.md?render&hello-world` - like the previous hello-world, but with the rendered HTML code instead of the raw markdown
- `/messy-code/file.css`
  - `/messy-code/file.css`
  - `/messy-code/file.css?highlight`
  - `/messy-code/file.css?format`
  - `/messy-code/file.css?format&highlight`
  - `/messy-code/file.css?hello-world`
  - `/messy-code/file.css?format&hello-world`
- `/languages/file.js`
  - `/languages/file.js?highlight`
  - `/languages/file.js?flowchart`
  - `/languages/file.js?review`
- `/simplit`
  - `/simplit/file.js.md`
  - `/simplit/file.js.md?render`
  - `/simplit/file.js.md?highlight`
  - `/simplit/file.js.md?simplit&highlight`
  - `/simplit/file.js.md?simplit&flowchart`

---

## The Student's Perspective

There are a lot of different lenses, and they sometimes will pipe in unhelpful or unexpected ways.  it's also not very student-friendly to be adjusting params all the time. so ...

the `/src/lenses/directory` lense addresses this problem by configuring default (and hopefully helpful) lenses / url queries for different file types.  this way students can benefit from the most productive instructor-configured settings out of the box.  ie. no need to know the tool to use it.

