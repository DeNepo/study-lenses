const helloWorldLense = async (resource, config) => {

  resource.mime = 'text/html';
  resource.content = `
<!DOCTYPE html>
  <html>
  <head></head>
  <body>
    <pre>
${JSON.stringify(config, null, '  ')}
    </pre>
    <textarea style="height: 100vh; width: 100vw;">${resource.content}</textarea>
  </body>
  <script src="${config.ownStatic}/script.js"></script>
  <script src="${config.sharedStatic}/hello.js"></script>
  <link rel="stylesheet" href="${config.ownStatic}/style.css">
</html>`;

  return resource;
};

module.exports = helloWorldLense;
