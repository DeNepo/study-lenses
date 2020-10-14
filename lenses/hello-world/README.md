# Hello World Lense

a basic lense to showcase how to develop a lense.

---

lenses are used to process the requested file contents before sending the response.  they are determined by the queries in the URL parameter, piping the file contents through each indicated param in the order they appear in the URL.

lenses can process the file contents however they want, but are expected to update the mime type if they change it (ie. converting markdown to HTML, or embedding js code in an HTML file to be styled and read as source)

---

this lense is helpful for debugging the server as it shows all the data a lense should receive and tests both static paths (own & shared)
