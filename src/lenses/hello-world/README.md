# Hello World Lense

a basic lense to showcase how to develop a lense.

---

lenses are used to process the requested file contents before sending the response.  they are determined by the queries in the URL parameter, piping the file contents through each indicated param in the order they appear in the URL.

lenses can process the file contents however they want, but are expected to update the mime type if they change it (ie. converting markdown to HTML, or embedding js code in an HTML file to be styled and read as source)

A lense is a function like this:

- args:
  - `simpReq` _object_: a simplified request object composed of values from the express request object
    ```js
      {
        url: req.url,
        method: req.method,
        body: req.body,
        header: req.headers,
        cookies: req.cookies,
        query: req.query,
        hostname: req.hostname
      }
    ```
  - `resource` _object_:
    - `absPath` _string_: the absolute path to the requested file
    - `relPath` _string_: the relative path to the requested file (same as req.url with params stripped away)
    - `content` _string_: the string content to process
    - `mime` _string_: the mime type for this content (lenses are expected to update the mime type if necessary).
    - `status` _number | numbery string_: defaults to 200
  - `config`: a config passed in by `server/handle-request.js`, it matches this schema:
    - `name` _string_: the name of the lense (derived the folder name for the lense)
    - `query` _string_: the value passed to this lenses' param in the url (empty string if the param had no value)
    - `ownStatic` _string_: a prefix to append to any script or style tags if your lense renders HTML, directs to `/src/lenses/lense-name/static`.
    - `sharedStatic` _string_: a prefix to append to any script or style tags if your lense renders HTML, directs to `/src/static`.
    - `origin` _string_: the origin for this hosting (cdn or localhost)
- return: _object_
    - `content` _string_: the string content to process
    - `mime` _string_: the mime type for this content (lenses are expected to update the mime type if necessary)

---

this lense is helpful for debugging the server as it shows all the data a lense should receive and tests both static paths (own & shared)
