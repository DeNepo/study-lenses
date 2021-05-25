# Study Lenses

a tool to add new perspectives and layers of interactivity on top of existing code.

- [Getting Started](#getting-started)
- [UPI](#upi)
- [`--help`](#--help)
- [Plugins](#plugins)
  - [Lenses](#lenses)
  - [Options](#options)
- [Deploying](#deploying)
- [Source Walk-Through](#source-walk-through)
- [Docs](./DOCS.md)
- [known bugs](#known-bugs)

---

## Getting Started

### To Explore the Test Content

1. `$ npm install`
2. `$ npm run test-content`

### To Explore Anything on your Computer

If you would like to this server with files from your computer that are not in `/test-content` you will need to install it as a global dependency.

1. `git clone` the repo
2. `cd study-lenses` into repo
3. `npm install -g .`
   - installing this repository as a global dependency will let you test your changes in realtime
4. `npm run test-content`

---

## UPI

This tool has a URL Parameter Interface, the student controls how they view and study their code by modifying the URL parameters when requesting a resource. At it's base, this is just a static server. requesting a path inside the folder you have `study`ed will send the raw content. however ...

URL params can be used to modify the resource before it is sent. once you have a directory open in your browser using `$ study`, navigate to a file and add `?hello-world` to the end of the URL and refreshing. You can find the source code for this lens in [./src/lenses/hello-world](./src/lenses/hello-world). (This is a [Lens](#lens). There is another type of URL parameter called an [Option](#option) that will be covered in more detail later.)

To see lenses in action, open the `/test-content` (`$ npm run test-content`) directory as indicated in **Getting Started** and try pasting in these url extensions and refreshing:

- `/README.md`
  - `/README.md` - no lens, the markdown source is returned as-is
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
  - `/languages/file.js?study`

There are a lot of different lenses, and they sometimes will compose in unhelpful or unexpected ways. it's also not very student-friendly to be adjusting params all the time. so ...

The server comes with a default lenses `?hyf` that opens a directory as a navigable folder structure. Each subdirectory and file is a link that opens with a sane default lens so students won't need to understand how to use params or read lens guides to get started. Here are a few of the defaults:

- `.html` files will open without a lens, as a live website (`study` is just an augmented static server. `import`/`export`, local `fetch` calls, it all works! )
- `.js` files open up in a monaco editor with configurable study options.
- `.json` files open as colored and collapsible data
- ...

---

## `--help`

Adding `--help` anywhere in your query (ie. `/path/file.js?hyf&--help`) will send a guide to how you can use this tool including:

- the general idea
- a list of all lenses and links to their user guides
- a list of all options and links to their user guides

---

## Plugins

There are two types of plugins, head over to [DOCS](./DOCS.md) for full details. here's a quick summary:

### Lenses

lenses are functions that process the requested resource before the final HTTP response is generated. They exist to change the way a student sees or interacts with a given resource while in the browser. Lenses can be composed to create a variety of study experiences, some examples:

- `/file.js` will send the raw js code
- `/file.js?format` will format the code before sending it (in case the source file is messy)
- `/file.js?format&highlight` will format the code, then render it into an HTML file using Prism (or other) for highlighted code in the browser

The most basic lens could just be a function that reverses the text stored in the file.

### Options

Options are inspired by [cli conventions](https://nullprogram.com/blog/2020/08/01/). Option arguments are passed the same way as lenses: as a URL parameter. They are similar to lenses but fall "outside" the normal control flow, they are filtered out of the params and evaluated before the resource is processed by lenses.

In contrast to lenses, an option can end the request/response cycle early if indicated in their return value, ie. `--help` will send user documentation regardless of where it is placed in the URL, what other lenses were requested, or what the resource path is.

Options can also return hooks that are called at different points in the lens pipeline process. Hooks cannot modify the content or HTTP response without immediately ending the cycle. For example, the `--debug` option return hooks that log each stage of the lens pipeline for diagnosis _without_ modifying the behavior of the pipeline (useful for lens developers and especially curious students). More on this in the [DOCS](./DOCS.md)

---

## Deploying

besides local studying, this module should be equipped for deployment. it should probably support at least these ways:

- normal deployment on a server. (not a problem, should work as-is)
- deployment on a service like netlify functions or aws lambdas, configurable with github actions and npm scripts (i think this is possible because the server is stateless and just reads/modifies files from directory)

---

## Source Walk-Through

> also, [the docs](./DOCS.md)

Head over to [./bin/index.js](./bin/index.js) and follow the comments for a guided walk-through of the code base. Some files will contain a comment at the bottom indicating which files to read next. If nothing is mentioned, you can take abstractions at face value unless you're the curious type.

If you're a little curious, but not too curious, there's this:

```
|- bin
| |- index.js -- entry point for the global cli
|
|- config -- global configuration files
|
|- lenses
| |- index.js -- parses and loads the lenses
| |- lens-name -- each lens is stored in it's own folder
|   |- static -- (optional) for own static assets if the lens renders a web page
|   |- index.js -- entry point to the lens
|   |- README.md -- describe your lens, including specs for other lens authors to compose
|   |- user-guide.md -- a student-friendly guide, dynamically included by the `--lenses` option
|
|- options
|  |- index.js -- parses and loads the options
|  |- --option-name -- each option is stored in it's own folder
|    |- static -- (optional) for own static assets if the option renders a web page
|    |- index.js -- entry point to the option
|    |- README.md -- describe your option, including specs
|    |- user-guide.md -- a student-friendly guide, dynamically included by the `--options` option
|
|- server
| |- index.js -- entry point for the server, uses /handle-request
| |- handle-request
|   |- lib
|   |- index.js -- reads the requested resource, executes options, pipes the resource+lenses and responds
|   |- (go there to see the rest in detail)
|
|- static -- shared static resources (monaco editor, parsons library, mermaid, prism, ...)
|
|- test-content -- a whole bunch of code and markdown for testing out lenses
```

---

## Known Bugs
