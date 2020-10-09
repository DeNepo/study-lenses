const fs = require('fs');
const util = require('util');

const writeFilePromise = util.promisify(fs.writeFile);

const notepadLense = async (req, resource, config) => {
  const { absPath, relPath } = config;

  if (req.method === 'POST') {
    console.log('-- POST')
    try {
      await writeFilePromise(absPath, req.body.text, 'utf-8');
      return {
        content: 'changes were saved',
        mime: 'text/plain'
      }
    } catch (err) {
      console.log(err);
      return {
        content: 'unable to save changes.  check console for more info',
        mime: 'text/plain',
        status: 500
      }
    }
  }

  resource.mime = 'text/html';
  resource.content = `<html>

<head>
  <meta charset="UTF-8">
  <title id='title'>${relPath}</title>
  <link rel="icon" href="data:;base64,iVBORw0KGgo=">

</head>

<body>

  <button id='save-button'>save changes</button>
  <div id='editor-container' style="height: 90vh; width: 95vw;"></div>

  <link rel="stylesheet" data-name="vs/editor/editor.main" href="${config.sharedStatic}/monaco/min/vs/editor/editor.main.css">

  <script>var require = { paths: { 'vs': '${config.sharedStatic}/monaco/min/vs' } };</script>
  <script src="${config.sharedStatic}/monaco/min/vs/loader.js"></script>
  <script src="${config.sharedStatic}/monaco/min/vs/editor/editor.main.nls.js"></script>
  <script src="${config.sharedStatic}/monaco/min/vs/editor/editor.main.js"></script>

  <script src="${config.ownStatic}/init.js"></script>
  <script> init("${config.relPath}"); </script>

</body>

</html>`;

  return resource;

};

module.exports = notepadLense;
