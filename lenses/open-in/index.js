'use strict';

const generateUrl = require('./generate-url.js');

const openInLens = async ({ resource, config }) => {
  if (!resource.info && !resource.content) {
    return;
  }

  if (resource.info.ext !== '.js') {
    return;
  }

  if (typeof resource.content !== 'string') {
    return;
  }

  if (!(config.queryValue.toLowerCase() in generateUrl)) {
    return;
  }

  const URL = generateUrl[config.queryValue.toLowerCase()](resource.content);

  resource.content = `
<!DOCTYPE html>
  <html>
  <head></head>
  <body>
    <code><pre id='the-code'>${resource.content}</pre></code>
    <script>
      const redirect = confirm("redirecting to ${config.queryValue} ...");
      if (redirect) {
        // if ("${config.queryValue}" === "algoviz") {
        //   // https://stackoverflow.com/a/30810322
        //   // if (!navigator.clipboard) {
        //     debugger
        //   const textArea = document.createElement("textarea");
        //   textArea.value = decodeURI("${encodeURI(resource.content)}");
        //   console.log(textArea.value)

        //   // Avoid scrolling to bottom
        //   textArea.style.top = "0";
        //   textArea.style.left = "0";
        //   textArea.style.position = "fixed";

        //   document.body.appendChild(textArea);
        //   textArea.focus();
        //   textArea.select();

        //   try {
        //     const successful = document.execCommand("copy");
        //     const msg = successful ? "successful" : "unsuccessful";
        //     if (successful) {
        //       console.log("copying text command was " + msg);
        //       alert(
        //         "your code is copied, you can paste it in algoviz after the site opens"
        //       );
        //       // window.open("${URL}", "_self");
        //     } else {
        //       console.log("copying text command was " + msg);
        //       alert(
        //         "oops, something went wrong copying your code. try refreshing"
        //       );
        //     }
        //   } catch (err) {
        //     alert('something went wrong copying your code, try reloading the page')
        //     console.error("Oops, unable to copy", err);
        //   }

        //   document.body.removeChild(textArea);
        // } else {
          window.open("${URL}", "_self");
        // }
      }
    </script>
  </body>
</html>`;
  resource.info.ext = '.html';

  return {
    resource,
  };
};

module.exports = openInLens;
