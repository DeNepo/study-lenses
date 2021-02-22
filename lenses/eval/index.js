"use strict";

const evalLens = ({ resource, config, requestData }) => {
  if (!resource.info && !resource.info.ext === ".js") {
    return;
  }

  resource.info.ext = ".html";
  resource.content = `
<!DOCTYPE html>
  <html>
  <head></head>
  <body>
    <script>
      const script = document.createElement('script');
      script.type = 'module';
      script.innerHTML = decodeURIComponent(\`${encodeURIComponent(
        resource.content
      )}\`);

      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.onload = () => iframe.contentDocument.body.appendChild(script);
      document.body.appendChild(iframe);
    </script>
  </body>
</html>`;

  return { resource };
};

module.exports = evalLens;
