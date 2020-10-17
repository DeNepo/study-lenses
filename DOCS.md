# Study Lenses Docs

How does this work?  Let me explain you

- [The Server](#the-server)
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

This server is relatively simple: [./server/index.js](./server/index.js) launches a basic express server with one handler ([handle-request](./server/handle-request/index.js)).  All requests to any path and with any method are handled by this function.

## `handle-request`

By default (without any options or lenses), this is a basic static server. All requests are handled as a GET request for the resource stored at the requested url (relative path from working directory).

Lenses and Options can be written to treat POST request differently from GET requests, can make arbitrary network calls, and have access to the file system. More on this later.

If a user has requested any plugins with URL parameters (ie. `/file.js?format&highlight`) then the `resource`, `requestData`, and `responseData` will be processed consecutively by the `format` and the `highlight` Lenses before being appended to the request body and sent.

[TOP](#study-lense-docs)

---

## Data Types

These data types are the core of this application, they are used throughout `handle-request` to represent the HTTP req/res, the requested resource, and Lenses/Options (both are plugin types).  At the end of the request/response cycle, the `responseData` and `resource` will be parsed into an HTTP response and sent.

### `requestData`

A subset of the HTTP request will be passed to lenses and options, see [subset-http-data](./server/handle-request/subset-http-data/index.js) for implementation.  it is created by reading from the express-parsed request:

<details>
<summary>request data initialized to:</summary>

```javascript
const requestData = {
  path: req.path,
  method: req.method,
  body: deepClone(req.body),
  headers: deepClone(req.headers),
  cookies: deepClone(req.cookies),
}
```

</details>
<br>

### `responseData`

A subset of the HTTP response will be passed to lenses and options, see [subset-http-data](./server/handle-request/subset-http-data/index.js) for implementation.  it is created by reading from the express-parsed response.  lenses don't have direct access to the `.body` property because the body will be generated from `resource`, to modify the body lenses modify `resource.content` (and `resource.info.ext` if changing mime type):

<details>
<summary>response data initialized to:</summary>


```javascript
const responseData = {
  status: 200,
  headers: {},
  cookies: {},
}
```

</details>
<br>

### `resource`

When a user requests a resource it will be represented as an object, see [resource-from-absolute-path](./server/handle-request/resource-from-absolute-path/index.js) for implementation.  Examples:

<details>
<summary>A file resource</summary>

```javascript
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
  contents: "file contents as a string",
  error: null
}
```

</details>
<br>


<details>
<summary>A directory resources</summary>

```javascript
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
  error: null
}
```

</details>
<br>

<details>
<summary>A non-existent resource</summary>

```javascript
{
  info: null,
  content: null,
  error: null
}
```

</details>
<br>

<details>
<summary>an error occurred </summary>

```javascript
{
  info: null,
  content: null,
  error: new Error('the thrown exception')
}
```

</details>
<br>

### `plugin`

This is the data type used within the server to represent a Lense or an Option.  Lenses and Options may be represented by the same data type, but are used differently by `handle-request` only based on where they are stored - either in `/lenses` or `/options`.  The `plugin` data type is generated in [./server/handle-request/load-plugins.js](./server/handle-request/load-plugins.js)

While Lenses and Options are represented by the same data type, they are called by two names because `handle-request` uses them quite differently.  The `.module` function of a Lense can be thought of as an option module where the server ignores certain arguments and return values. More on that in the specs below


<details>
<summary>an example plugin object</summary>

```javascript
{
  module: () => { "the plugin function" },
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


The config object is passed as an argument to plugin modules.  They're just a copy of the module's `plugin` object with the `.module` removed.  this takes place in [./server/handle-request/evaluate-options/index.js](./server/handle-request/evaluate-options/index.js) and [./server/handle-request/pipe-resource/index.js](./server/handle-request/pipe-resource/index.js)

The server will also scan the request's directory and parents (up to `cwd`) searching for a `lenses.json` file, generating a custom configuration by deep assigning configurations lower in the folder structure onto higher ones. At the end there will be an object with keys corresponding to plugin `.queryKey`s. For each requested plugin the local configuration will be assigned into the the `config` object.  This allows repositories of content to be written and configured specifically for a lense. ie. indicating that javascript files are `eval`-friendly, or loading helper functions like `deepCompare`.

<details>
<summary>an example config object</summary>

```javascript
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

[TOP](#study-lense-docs)

---


## [Lenses](./lenses)

This application's whole _raison d'être_

Lenses are loaded into the server as an array of `plugin` objects, parsed from the `/lenses` directory.  When a request with lense parameters is received, the indicated lenses are filtered out from all the .lenses and used to process the resource before sending the response

Lenses are used to process the `resource`, `requestData` and `responseData`, transforming the resource for study. They are called one after the other, the return values of the last being fed into the next in the order they are written into the URL.

Lense arguments and return values are copied, not passed by reference. The only way for them to modify the response is to return modified data.  If a Lense returns nothing or an invalid `requestData`, `responseData` or `resource`, the previous data will be passed again to the next lense.

- Lenses are called in [./server/handle-request/pipe-resource/index.js](./server/handle-request/pipe-resource/index.js)

<details>
<summary>example Lense function</summary>

```javascript
const aLense = async ({ requestData, responseData, resource, config }) => {

  return {
    requestData,
    responseData,
    resource
  }
}
```

</details>
<br>

Lense behavior can go from very simple to very complex, here's an artificial hierarchy of lenses:

1. **Basic**: Pure functions that transform the `requestData`, `responseData` and/or `resource` data then return the changes.  Check out the `reverse` function that simply reverses `resource.content` if it is a string.
2. **Static**: Static lenses take advantage of `config.ownStatic` and/or `config.sharedStatic` to send static web pages.  This could include embedding the requested resource in an editor, highlighting it in an HTML document, or anything else a static web page can do. Check out the `hello-world` lense for the kitchen sink
3. **CRUD**: lenses have access to the file system.  You could write a static lense that "routes" POST requests to itself using URL params then updates or creates files on disk. (no examples of this yet)
4. **Web**: lenses can send & receive HTTP requests (`http`, `node-fetch`, ...).  Imagine a `?translate=dutch` lense that uses the DeepL API to translate a text before forwarding the response to the browser. (no examples of this yet)
5. **Client/Server**: One of these is essentially a fullstack server embedded within the study server.  The lense can send a frontend app that "routes" all requests back to the lense using it's URL parameter.  It can can then send arbitrary data back and forth using the req/res bodies. (no examples of this yet)

[TOP](#study-lense-docs)

---

## [Options](./options)

> options do not all have an associated plugin.  see the options' individual documentation for more details

Inspired by [cli conventions](https://nullprogram.com/blog/2020/08/01/) (but not exactly alike), Options are params that are prefixed with `--` and operate "outside" the normal control flow to observe, modify, or stop the server's behavior.  Requested Options will be filtered out and evaluated before the resource is processed by any Lenses.  In contrast to Lenses, an Option cannot modify the `resource` without ending the request/response cycle (ie. `--help` will send a user guide).

 Options will be executed in order passing the (possibly) modified res/req on to the next, each one receiving the same original data.  If an Option returns a `resource` or `responseData` object, they will be used to generate the response and the Lenses will not be piped. After the first Option returns valid data, the others will still be executed but their data will be ignored (useful for debugging or reporting Options).

- Options are called in [./server/handle-request/evaluate-options/index.js](./server/handle-request/evaluate-options/index.js)

<details>
<summary>example option function</summary>

```javascript
const anOption = async ({
    requestData, responseData, resource, config,
    lenses, options // copied arrays of all requested lenses & options
  }) => {

  return {
    // if a valid resource or resData is returned, the cycle ends and the resource is sent
    resource,
    responseData,
    // these are evaluated at different points in the lense pipeline
    hooks: {
      beforeAll,
      afterAll,
      beforeEach,
      afterEach,
      error,
    },
    // ignored
    requestData,
  }
}
```

</details>
<br>

[TOP](#study-lense-docs)

---

### Hooks

Hooks are functions returned from an option that will be executed at different points in the lense pipeline.  If a Hook returns a valid `responseData` or `resource`, the cycle will be ended without piping then next Lense and the Hook's data will be rendered into an HTTP response.

- Hooks are returned from their option in [./server/handle-request/evaluate-options/evaluate-hooks.js](./server/handle-request/evaluate-options/evaluate-hooks.js)
- Hooks are assigned the `.queryKey` from their Option when returned. This is helpful for debugging later on as they are stored as an array of functions, and hook function names cannot be configured by their Option
- Hooks are called in [./server/handle-request/pipe-resource/evaluate-hooks.js](./server/handle-request/pipe-resource/evaluate-hooks.js)

> this needs some help, in concept and in code

<details>
<summary>example hook function</summary>

```javascript
// (hooks have access to their parent's config by closure)
const aHook = async ({
    requestData, responseData, resource,
    lense, lenses, // the current lense, and all requested lenses
    error /* for onError hooks */
  }) => {

  return {
    // if a valid resource or responseData is returned, the cycle ends and the resource is sent
    resource,
    responseData,
    recover, // if true and returned from an onError hook
    // the pipeline will recover to the next lense
    // otherwise piping ends after the first error
    // and a nice message is sent to the browser
  }
}
```

</details>
<br>

- **`beforeAll`**: Evaluated _before_ the lense pipeline is begun.
- **`afterAll`**: Evaluated _after_ the lense pipeline has completed. This will be evaluated whether or not there was an error
- **`beforeEach`**: Evaluated _after_ the pipeline has begun, and _before_ the current lense is evaluated.
- **`afterEach`**: Evaluated _after_ the pipeline has begun, and _after_ the current lense is evaluated.  it will not be evaluated if an error occurs (unless using the `--recover` option)
- **`onError`**: Evaluated if an error occurs in the pipeline. the pipeline does not recover after an error unless this hook returns `.recover === true`

### [`--help`](./options/--help)

This hook sends a guide on how to use parameters, and the user guide for each Lense and Option.

- `?...--help...`

### [`--debug`](./options/--debug)

To see hooks in action, check out the `--debug` option.  This one is useful for lense developers and extra curious students

1. `$ study test-content/any/file.ext`
2. query `?reverse` - the text will be reversed
3. query `?reverse&hello-world` - the text will be reversed, and embedded in the hello-world lense
4. query `?reverse&error` after your query.  this lense just throws an error, you will see the default handling of a lense error
5. now try `?--debug&reverse&error&hello-world` or `?reverse&--debug&error&hello-world` or `?reverse&error&hello-world&--debug`.  Be sure to check your console!

### [`--recover`](./options/--recover)

another option:

1. `$ study test-content/any/file.ext`
2. query `?reverse&error&hello-world`
3. now try `?reverse&error&--recover&hello-world` or `?--recover&reverse&error&hello-world` ...

### [`--defaults`](./options/--defaults)

certain directory-view lenses may use these defaults.  generated by assigning the values from the param `--defaults` onto the the local configuration value.  the final `defaults` object will be passed to all lenses

this option exists to create repositories of specialized exercises.  ie. a repository of code snippets for parsons problems. (see `/test-content/parsons`)

### `--ignore`

> does not have a plugin.  used to configure the handler at the beginning of a cycle

- local config file: true/false
- param: exists or not

this is all-or-nothing.   there is no way to ignore selected lenses

the idea here is to force the server into basic static-serverhood with local configurations

[TOP](#study-lense-docs)

---

## Local Configurations

The `study` server also supports local configurations in `study.json` files.  Configurations in a directory apply to all sub-directories. If there is a `study.json` file in a sub-directory, matching keys in the lower config will be assigned onto the higher config (ie. lense configurations are cumulative)

There are two supported local Option configurations and one field per lense.

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
    "openIn": [
      "jsTutor"
    ]
  },
  "--defaults": {
    ".md": "render",
    ".css": "parsons"
  }
}
```

</details>
<br>


### Lense Configurations

When a request is parsed, the server will read local configurations and search for a key matching each requested lense.  If a matching local configuration key exists, all properties will be assigned onto the the Lense's `config` object.

There is no standard for local Lense configurations, each lense can support whatever field it chooses.

### Option Configurations

there are two supported configurations:

- `--defaults` _object_: configures the default lenses by file type for the current directory and below. This will only impact lenses that refer to global defaults. For example with the `hyf` lense, changing this configuration will change how files open when navigating in the browser.  Check out [./test-content/parsons](./test-contents/parsons) to see this configuration in action
- `--ignore` _boolean_: don't parse or evaluate any Options or Lenses.  Converts the server to a basic static server, useful if code in a sub-directory uses it's own parameters

[TOP](#study-lense-docs)

---

## All together

play around with this: `?reverse&--ignore&error&--debug&hello-world=bye&--recover`

[TOP](#study-lense-docs)

---

## Next Steps

Once all this works and is reliable:

- tests for new lenses and options
- architected for deployment on netlify
- global server configurations
  - `port`
  - `trust` ?
    - should requests be trusted?
    - when running locally, sure. when deployed, no
    - this can be passed as config into lenses & options
    - then a lense can modify their behavior if `trust` is true (ie. saving changes to disk)

[TOP](#study-lense-docs)
