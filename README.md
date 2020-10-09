# Study Lenses

a cli app to open directories of code in the browser with varying types of interactivity.

## Getting Started

1. `git clone` the repo
2. `cd` into repo
3. `npm install -g .` (install this repository as a global dependency)
4. `cd test`
5. `study` (run the global CLI)

## Lenses & URL Parameters

at it's base, this is just a static server.  requesting a path inside the folder you have `study`ed will send the raw text. however ...

URL params can be used to view the source through different lenses.  once you have test running try entering the path to a file, adding `?hello-world` to the end of the URL and refreshing.  You can find the source code for this lense in [./src/lenses/hello-world](./src/lenses/hello-world)
