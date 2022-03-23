> you can read these docs plus the docs.md for all lenses and options by running
> `$ study` locally and using the `?--docs` option

# Study Lenses Docs

How does this work? Let me explain you

- [The Server](#the-server)
  - [Default Behavior](#default-behavior)
  - [Changing Perspective](#changing-perspective)
- [Data Types](#data-types)
  - [`resource`](#resource)
  - [`requestData`](#requestData)
  - [`responseData`](#responseData)
  - [`plugin`](#plugin)
  - [`config`](#config)
- [Lenses](#Lenses)
- [Options](#options)
  - [`--help`](#--help)
  - [`--debug`](#--debug)
  - [`--recover`](#--recover)
  - [`--defaults`](#--defaults)
  - [`--ignore`](#--ignore)
- [Hooks](#hooks)
- [Local Configurations](#local-configurations)
- [All Together](#all-together)
- [Next Steps](#next-steps)

---

## Server

This server is relatively simple: [./server/index.js](./server/index.js)
launches an augmented static server.

### Default Behavior

`study`'s default behavior is an augmented static server with special behavior
for `index.html`, `readme.md` and `summary.md` files. Assuming there are no
parameters in the request:

- A requested will be served with `express.static`
- A requested directory will pass through these checks:
  - `summary.md`: if this file exists in relative root, the directory is
    rendered like a gitbook
  - `index.html`: if this file exists in relative root, it is served
  - `readme.md`: inf this file exists in relative root, it is rendered to HTML
    and served
  - otherwise, the server falls back to `express.static` behavior for
    directories

### Changing Perspective

If a user has included any URL parameters (ie. `/file.js?format&highlight`) then
the indicated options and lenses will be used in order to process the requested
resource (directory or file). Non-existent options or lenses are ignored.

This takes place in `/server/changing-perspective`.

[TOP](#study-lens-docs)

---

## Data Types

These data types are the core of this application, they are used throughout
`handle-request` to represent the HTTP req/res, the requested resource, and
Lenses/Options (both are plugin types). At the end of the request/response
cycle, the `responseData` and `resource` will be parsed into an HTTP response
and sent.

### `requestData`

A subset of the HTTP request will be passed to lenses and options, see
[./server/study.js](./server/study.js) for implementation. it is created by
reading from the express-parsed request:

<details>
<summary>request data initialized to:</summary>

```js
const requestData = {
  path: req.path,
  method: req.method,
  body: deepClone(req.body),
  headers: deepClone(req.headers),
  cookies: deepClone(req.cookies),
};
```

</details>
<br>

### `responseData`

A subset of the HTTP response will be passed to lenses and options, see
[./server/study.js](./server/study.js) for implementation. it is created by
reading from the express-parsed response. lenses don't have direct access to the
`.body` property because the body will be generated from `resource`, to modify
the body lenses modify `resource.content` (and `resource.info.ext` if changing
mime type):

<details>
<summary>response data initialized to:</summary>

```js
const responseData = {
  status: 200,
  headers: {},
  cookies: {},
};
```

</details>
<br>

### `resource`

When a user requests a resource it will be represented as an object, see
[resource-from-absolute-path](./server/resource-from-absolute-path/index.js) for
implementation. Examples:

<details>
<summary>A file resource</summary>

```js
{
  info: {
    root: '/Users/absolute/path/to/working/directory',
    dir: 'relative/path',
    base: 'file-name.js',
    ext: '.js',
    name: 'file-name',
    type: 'file',
    toCwd: '../..',
  },
  content: "file contents as a string",
  path: "Users/absolute/path/to/resource.js",
  error: null
}
```

</details>
<br>

<details>
<summary>A directory resources</summary>

```js
{
  info: {
    root: '/Users/absolute/path/to/working/directory',
    dir: 'relative/path',
    base: 'path',
    ext: '',
    name: 'path',
    type: 'directory',
    toCwd: '../..',
    locals: {
      "local configurations": "from study.jsons",
      "lower configs": "are merged with higher configs",
      "lower configs": "have precedence"
    }
  },
  content: {
    root: '/Users/absolute/path/to/working/directory',
    dir: 'relative/path',
    base: 'path',
    ext: '',
    name: 'path',
    type: 'directory'
    children: [ { nested }, { info }, { objects } ]
  },
  path: "Users/absolute/path/to/resource",
  error: null
}
```

</details>
<br>

<details>
<summary>A non-existent resource</summary>

```js
{
  info: null,
  content: null,
  path: "Users/absolute/path/to/resource/.js",
  error: null
}
```

</details>
<br>

<details>
<summary>an error occurred </summary>

```js
{
  info: null,
  content: null,
  error: new Error('the thrown exception')
}
```

</details>
<br>

### `plugin`

This is the data type used within the server to represent a Lens or an Option.
Lenses and Options may be represented by the same data type, but are used
differently by `handle-request` only based on where they are stored - either in
`/lenses` or `/options`. The `plugin` data type is generated in
[./server/load-plugins.js](./server/load-plugins.js)

While Lenses and Options are represented by the same data type, they are called
by two names because `handle-request` uses them quite differently. The `.module`
function of a Lens can be thought of as an option module where the server
ignores certain arguments and return values. More on that in the specs below

<details>
<summary>an example plugin object</summary>

```js
{
  module: ({ resource, config, ... }) => { "the plugin function" },
  use: ({ resource, config, ... }) => {
    "calls this plugin function as though it were requested";
    "any arguments passed will replace the defaults0";
    "returns the lens's return value";
    "practical when you want to use lenses from inside other lenses";
  },
  queryKey: `identifying query name - the folder name`,
  queryValue: {
    "express-parsed": "query value",
    "the server will try": "to JSON.parse each one"
  },
  ownStatic: `own_static_resource__lenses__folder-name`,
  sharedStatic: `shared_static_resource`,
  userGuide: 'markdown text from the user guide',
  locals: {} // local configurations, empty by default
}
```

</details>
<br>

### `config`

The config object is passed as an argument to plugin modules. They're just a
copy of the module's `plugin` object with the `.module` removed. this takes
place in
[./server/change-perspective/evaluate-options/index.js](./server/change-perspective/evaluate-options/index.js)
and
[./server/change-perspective/pipe-resource/index.js](./server/change-perspective/pipe-resource/index.js)

The server will also scan the request's directory and parents (up to `cwd`)
searching for a `lenses.json` file, generating a custom configuration by deep
assigning configurations lower in the folder structure onto higher ones. At the
end there will be an object with keys corresponding to plugin `.queryKey`s. For
each requested plugin the local configuration will be assigned into the the
`config` object. This allows repositories of content to be written and
configured specifically for a lens. ie. indicating that javascript files are
`eval`-friendly, or loading helper functions like `deepCompare`.

<details>
<summary>an example config object</summary>

```js
{
  queryKey: `identifying query name - the folder name`,
  queryValue: {
    "express-parsed": "query value",
    "the server will try": "to JSON.parse each one"
  },
  ownStatic: `own_static_resource__lenses__folder-name`,
  sharedStatic: `shared_static_resource`,
  userGuide: 'markdown text from the user guide',
  locals: {} // local configurations, empty by default
}
```

</details>
<br>

[TOP](#study-lens-docs)

---

## [Lenses](./lenses)

This application's whole _raison d'être_

Lenses are loaded into the server as an array of `plugin` objects, parsed from
the `/lenses` directory (for "native" lenses that come with this module) or the
`/.study-lenses` directory in your code's repository (for custom lenses). When a
request with lens parameters is received, the indicated lenses are filtered out
from all the configured lenses and used to process the resource before sending
the response

Lenses are used to process the `resource`, `requestData` and `responseData`,
transforming the resource for study. They are called one after the other, the
return values of the last being fed into the next in the order they are written
into the URL.

Lens arguments and return values are copied, not passed by reference. The only
way for them to modify the response is to return modified data. If a Lens
returns nothing or an invalid `requestData`, `responseData` or `resource`, the
previous data will be passed again to the next lens.

- Lenses are called in
  [./server/change-perspective/pipe-resource/index.js](./server/change-perspective/pipe-resource/index.js)

<details>
<summary>example Lens function</summary>

```js
const aLense = async ({
  requestData,
  responseData,
  resource,
  config,
  // an array of all loaded lenses and plugins are also available in lenses
  //  this is useful for lenses like ?study that orchestrate other lenses
  lenses,
  resources,
}) => {
  return {
    requestData,
    responseData,
    resource,
    abort, // if true, the request/response cycle will fall back to default serving
  };
};
```

</details>
<br>

Lens behavior can go from very simple to very complex, here's an artificial
hierarchy of lenses:

1. **Basic**: Pure functions that transform the `requestData`, `responseData`
   and/or `resource` data then return the changes. Check out the `reverse`
   function that simply reverses `resource.content` if it is a string.
2. **Static**: Static lenses take advantage of `config.ownStatic` and/or
   `config.sharedStatic` to send static web pages. This could include embedding
   the requested resource in an editor, highlighting it in an HTML document, or
   anything else a static web page can do. Check out the `hello-world` lens for
   the kitchen sink
3. **CRUD**: lenses have access to the file system. You could write a static
   lens that "routes" POST requests to itself using URL params then updates or
   creates files on disk. (the ?study lens does this to save changes from the
   browser)
4. **Web**: lenses can send & receive HTTP requests (`http`, `node-fetch`, ...).
   Imagine a `?translate=dutch` lens that uses the DeepL API to translate a text
   before forwarding the response to the browser. (no examples of this yet)
5. **Client/Server**: One of these is essentially a fullstack server embedded
   within the study server. The lens can send a frontend app that "routes" all
   requests back to the lens using it's URL parameter. It can can then send
   arbitrary data back and forth using the req/res bodies. (no examples of this
   yet)

<!-- BEGIN LENSES -->
<!-- END LENSES -->

[TOP](#study-lens-docs)

---

## [Options](./options)

Inspired by [cli conventions](https://nullprogram.com/blog/2020/08/01/) (but not
exactly alike), Options are params that are prefixed with `--` and operate
"outside" the normal control flow to observe, modify, or stop the server's
behavior. Requested Options will be filtered out and evaluated before the
resource is processed by any Lenses. In contrast to Lenses, an Option cannot
modify the `resource` without ending the request/response cycle (ie. `--help`
will send a user guide).

Options will be executed in order passing the (possibly) modified res/req on to
the next, each one receiving the same original data. If an Option returns a
`resource` or `responseData` object, they will be used to generate the response
and the Lenses will not be piped\*. After the first Option returns valid data,
the others will still be executed but their data will be ignored (useful for
debugging or reporting Options).

- Options are called in
  [./server/change-perspective/evaluate-options/index.js](./server/change-perspective/evaluate-options/index.js)

<details>
<summary>example option function</summary>

```js
const anOption = async ({
  requestData,
  responseData,
  resource,
  config,
  // copied arrays of all requested lenses & options
  lenses,
  options,
}) => {
  return {
    // if a valid resource or resData is returned, the cycle ends and the resource is sent
    resource,
    responseData,
    // these are evaluated at different points in the lens pipeline
    hooks: {
      beforeAll,
      afterAll,
      beforeEach,
      afterEach,
      error,
    },
    // ignored
    requestData,
    abort, // if true, the request/response cycle will fall back to default serving
  };
};
```

</details>
<br>

> \* with the execption of the `--resource` option, which can be used from the
> frontend to replace the local resource at that path.

<!-- BEGIN OPTIONS -->
<!-- END OPTIONS -->

[TOP](#study-lens-docs)

---

### Option Hooks

Hooks are functions returned from an option that will be executed at different
points in the lens pipeline. If a Hook returns a valid `responseData` or
`resource`, the cycle will be ended without piping then next Lens and the Hook's
data will be rendered into an HTTP response.

- Hooks are returned from their option in
  [./server/change-perspective/evaluate-options/evaluate-hooks.js](./server/change-perspective/evaluate-options/evaluate-hooks.js)
- Hooks are assigned the `.queryKey` from their Option when returned. This is
  helpful for debugging later on as they are stored as an array of functions,
  and hook function names cannot be configured by their Option
- Hooks are called in
  [./server/change-perspective/pipe-resource/evaluate-hooks.js](./server/change-perspective/pipe-resource/evaluate-hooks.js)

> this needs some help, in concept and in code

<details>
<summary>example hook function</summary>

```js
// (hooks have access to their parent's config by closure)
const aHook = async ({
  requestData,
  responseData,
  resource,
  lens,
  lenses, // the current lens, and all requested lenses
  error /* for onError hooks */,
}) => {
  return {
    // if a valid resource or responseData is returned, the cycle ends and the resource is sent
    resource,
    responseData,
    recover, // if true and returned from an onError hook
    // the pipeline will recover to the next lens
    // otherwise piping ends after the first error
    // and a nice message is sent to the browser
  };
};
```

</details>
<br>

- **`beforeAll`**: Evaluated _before_ the lens pipeline is begun.
- **`afterAll`**: Evaluated _after_ the lens pipeline has completed. This will
  be evaluated whether or not there was an error
- **`beforeEach`**: Evaluated _after_ the pipeline has begun, and _before_ the
  current lens is evaluated.
- **`afterEach`**: Evaluated _after_ the pipeline has begun, and _after_ the
  current lens is evaluated. it will not be evaluated if an error occurs (unless
  using the `--recover` option)
- **`onError`**: Evaluated if an error occurs in the pipeline. the pipeline does
  not recover after an error unless this hook returns `.recover === true`

---

> this is just some of the most useful options, to learn about them all start
> study-lenses and navigate to `?--docs`

### [`--help`](./options/--help)

This hook sends a guide on how to use parameters, and the user guide for each
Lens and Option.

- `?...--help...`

### [`--debug`](./options/--debug)

To see hooks in action, check out the `--debug` option. This one is useful for
lens developers and extra curious students

1. `$ study test-content/any/file.ext`
2. query `?reverse` - the text will be reversed
3. query `?reverse&hello-world` - the text will be reversed, and embedded in the
   hello-world lens
4. query `?reverse&error` after your query. this lens just throws an error, you
   will see the default handling of a lens error
5. now try `?--debug&reverse&error&hello-world` or
   `?reverse&--debug&error&hello-world` or `?reverse&error&hello-world&--debug`.
   Be sure to check your console!

### [`--recover`](./options/--recover)

another option:

1. `$ study test-content/any/file.ext`
2. query `?reverse&error&hello-world`
3. now try `?reverse&error&--recover&hello-world` or
   `?--recover&reverse&error&hello-world` ...

### [`--defaults`](./options/--defaults)

certain directory-view lenses may use these defaults. generated by assigning the
values from the param `--defaults` onto the the local configuration value. the
final `defaults` object will be passed to all lenses

this option exists to create repositories of specialized exercises. ie. a
repository of code snippets for parsons problems. (see `/test-content/parsons`)

### `--force`

Forces all requests to be processed with their local default lenses, regardless
of whether any parameters were passed. particularly helpful for studying
repositories with markdown and relative links, so you don't need to write
`?--defaults` into each and every path.

This only exists as a local `study.json` config option. there's not point in
having it as a URL parameter, it's equivalent to using the `?--defaults` option
in a query.

### `--ignore`

> over-rides `?--force`

does not have a plugin. this is implemented at the beginning of
[./server/study.js](./server/study.js) to skip changing perspectives, no matter
what other lenses or options are used. all requests with this param will fall
back to standard express static serving.

especially useful for fetching assets in a `--force`ed setting - see
[./lenses/video/index.js](./lenses/video/index.js)

- local config file: `"--ignore": true`
- param: `?--ignore`

will eventually be able to ignore specific lenses, but for now is a
all-or-nothing.

[TOP](#study-lens-docs)

---

## Local Configurations

The `study` server also supports local configurations in `study.json` files.
Configurations in a directory apply to all sub-directories. If there is a
`study.json` file in a sub-directory, matching keys in the lower config will be
assigned onto the higher config (ie. lens configurations are cumulative)

There are two supported local Option configurations and one field per lens.

<details>
<summary>example `study.json` config file</summary>

```json
{
  "study": {
    "readOnly": false,
    "eval": true,
    "loopGuard": {
      "active": true,
      "max": 15
    },
    "openIn": ["jsTutor"]
  },
  "--defaults": {
    ".md": "render",
    ".css": "parsons"
  }
}
```

</details>
<br>

### Lens Configurations

When a request is parsed, the server will read local configurations and search
for a key matching each requested lens. If a matching local configuration key
exists, all properties will be assigned onto the the Lens's `config` object.

There is no standard for local Lens configurations, each lens can support
whatever field it chooses.

### Option Configurations

there are two supported configurations:

- `--defaults` _object_: configures the default lenses by file type for the
  current directory and below. This will only impact lenses that refer to global
  defaults. For example with the `hyf` lens, changing this configuration will
  change how files open when navigating in the browser. Check out
  [./test-content/parsons](./test-contents/parsons) to see this configuration in
  action
- `--ignore` _boolean_: don't parse or evaluate any Options or Lenses. Converts
  the server to a basic static server, useful if code in a sub-directory uses
  it's own parameters

[TOP](#study-lens-docs)

---

## All together

play around with this:
`?reverse&--ignore&error&--debug&hello-world=bye&--recover`

[TOP](#study-lens-docs)

---

## Next Steps

Once all this works and is reliable:

- tests for new lenses and options
- architected for deployment
  - right now there is no security as it's for running locally, studying local
    files
  - it is also not efficient with requests and assets for the same reason
- global server configurations
  - `trust` ?
    - should requests be trusted?
    - when running locally, sure. when deployed, no
    - this can be passed as config into lenses & options
    - then a lens can modify their behavior if `trust` is true (ie. saving
      changes to disk)

[TOP](#study-lens-docs)
