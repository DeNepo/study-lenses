const helloWorldOptions = async ({ requestData, responseData, config, resource, lenses, options }) => {

  resource.info.ext = '.html';
  resource.content = `
<!DOCTYPE html>
  <html>
  <head></head>
  <body>

    <pre>
resource.info: ${JSON.stringify(resource.info, null, '  ')}
resource.error: ${JSON.stringify(resource.error, null, '  ')}
resource.content:
    </pre>

    <textarea style="height: 50vh; width: 100vw;">${JSON.stringify(resource.content, null, '  ')}</textarea>

    <pre>
config -> ${JSON.stringify(config, null, '  ')}
    </pre>

    <pre>
responseData: ${JSON.stringify(responseData, null, '  ')}
    </pre>

    <pre>
requestData: ${JSON.stringify(requestData, null, '  ')}
    </pre>

    <pre>
lenses: ${JSON.stringify(lenses, null, '  ')}
    </pre>

    <pre>
options: ${JSON.stringify(options, null, '  ')}
    </pre>


    <script src="${config.ownStatic}/script.js"></script>
    <script src="${config.sharedStatic}/hello.js"></script>
    <link rel="stylesheet" href="${config.ownStatic}/style.css">
  </body>
</html>`;

  return { resource };
};

module.exports = helloWorldOptions;
