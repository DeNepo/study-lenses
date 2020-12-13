# Hello World Options

a basic option to showcase how to develop an options.

---

options are used to process the requested file contents before sending the response. they are determined by the queries in the URL parameter, piping the file contents through each indicated param in the order they appear in the URL.

options can process the file contents however they want, but are expected to update the mime type if they change it (ie. converting markdown to HTML, or embedding js code in an HTML file to be styled and read as source)

---

this option is helpful for debugging the server as it shows all the data a option should receive and tests both static paths (own & shared)
