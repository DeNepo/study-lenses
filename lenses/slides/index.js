'use strict';

const slidesLens = async ({ resource, config, lenses }) => {
  if (resource.info.ext !== '.md') {
    return resource;
  }

  config.locals = lenses.study.locals;

  resource.content = `
<!DOCTYPE html>
<html>
  <head>
    <title>${resource.info.base}</title>
    <meta charset="utf-8">

    <link rel="stylesheet" href="${config.sharedStatic}/prism/style.css">
    <link rel="stylesheet" href="${config.ownStatic}/styles.css">

    <script type="module" src="${
      config.sharedStatic
    }/web-components/study-lens.js"></script>
  </head>
  <body>
    <script src="${config.ownStatic}/remark-latest.min.js">
    </script>
    <script>
      const slideshow = remark.create({
        sourceUrl: './${resource.info.base}'
      });
    </script>

    <script>
      const config = JSON.parse(decodeURI("${encodeURI(
        JSON.stringify(config),
      )}"))
    </script>

    <script src="${config.sharedStatic}/prism/script.js"></script>
    <script src="${config.sharedStatic}/prism/toolbar.js"></script>

    <script type="module" src="${config.ownStatic}/init.js"></script>
  </body>
</html>`;
  resource.info.ext = '.html';

  return {
    resource,
  };
};

module.exports = slidesLens;
