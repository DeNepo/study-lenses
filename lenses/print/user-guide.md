## `?print`

This will render your code into a highlighted web page and open a print dialog. If you close the print dialog by accident you can always open again by printing the web page as you normally would.

There are 3 options:

- `?print=bw`: will print the page in black and white (no syntax highlighting)
- `?print=nn`: ("no numbers") will print the page without line numbers
- `?print=lang-_`: will highlight the code like this language -> `?print=lang-js`, `?print=lang-javascript`, `?print=lang-html`, ... If this is not provided it will default to the language of the file extension.

You can combine these options with a `+` like so (order does not matter): `?print=bw+nn`, `?print=nn+lang-js`, ...
