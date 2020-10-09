const helloWorldLense = async (simpReq, resource, config) => {

  resource.mime = 'text/html';
  resource.content = `
<!DOCTYPE html>
  <html>
  <head></head>
  <body>
    <pre>
simpReq -> ${JSON.stringify(simpReq, null, '  ')}
    </pre>
    <pre>
resource.mime -> ${resource.mime}
resource.status -> ${resource.status}
    </pre>
    <pre>
config -> ${JSON.stringify(config, null, '  ')}
    </pre>

    <textarea style="height: 100vh; width: 100vw;">${resource.content}</textarea>
    <script src="${config.ownStatic}/script.js"></script>
    <script src="${config.sharedStatic}/hello.js"></script>
    <link rel="stylesheet" href="${config.ownStatic}/style.css">
  </body>
</html>`;

  return resource;
};

module.exports = helloWorldLense;
