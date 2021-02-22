## `lit`

> not working

Checks if a markdown file is literate source code.  If the file has a sub-extension (ie. `file.js.md`), it will extract all the matching code blocks and concatenate them without the markdown.  The resource's extension will be changed to the nested extension.

Markdown files without a sub-extension will be returned unchanged, so will any other type of file
