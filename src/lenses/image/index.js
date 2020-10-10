// why no work?

const imgLense = async (simpReq, resource, config) => {
  const { relPath } = resource;

  resource.mime = 'text/html';
  resource.content = `
<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
  </head>
  <body>
    <script>
      const img = document.createElement('img');
      img.src = window.location.origin + "${relPath}";
      img.alt = "${relPath}";
      document.body.appendChild(img);
    </script>
  </body>
</html>`;

  return resource;
};

module.exports = imgLense;
