const copyLens = ({ resource, config }) => {
  resource.info.ext = '.html';
  resource.content = `
<!DOCTYPE html>
  <head></head>
  <body>
    <pre id="code">${
      typeof resource.content === 'string'
        ? resource.content
        : JSON.stringify(resource.content, null, '  ')
    }</pre>

    <script src="${config.ownStatic}/copy-code.js"></script>
  </body>
</html>`;

  return { resource };
};

export default copyLens;
