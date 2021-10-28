"use strict";

const path = require("path");
const fs = require("fs");
const util = require("util");
const writeFilePromise = util.promisify(fs.writeFile);

const detectType = require("./lib/detect-type");

const renderDependencies = require("./lib/render-dependencies");
const renderAppendices = require("./lib/render-appendices");

const liveStudyLense = async ({
  config,
  resource,
  responseData,
  requestData,
}) => {
  if (config.locals.save === true && requestData.method === "POST") {
    try {
      const absolutePath = path.join(
        resource.info.root,
        resource.info.dir,
        resource.info.base
      );
      await writeFilePromise(absolutePath, requestData.body.text, "utf-8");
      resource.content = ": changes were saved";
      // console.log(resource.content);
      resource.info.ext = ".txt";
      return {
        resource,
      };
    } catch (err) {
      console.log(err);
      responseData.status = 500;
      resource.content =
        "unable to save changes.  check server logs for more info";
      resource.info.ext = ".txt";
      return {
        resource,
        responseData,
      };
    }
  }

  if (config.queryValue && typeof config.queryValue.permalink === "object") {
    Object.assign(config, config.queryValue.permalink);
    resource.content = config.content || "";
    resource.info.ext = config.ext || resource.info.ext;
    resource.info.base = config.base || resource.info.base;

    config.locals.save = false;
  }
  // console.log(0);
  if (resource.content === null || resource.info === null || resource.error) {
    return;
  }

  // console.log(1);

  const type = detectType(resource);
  // console.log("--------", type);

  let typeView = () => {};
  try {
    typeView = new (require(`./views/${type}`))({ resource, config });
  } catch (o_0) {
    console.log(o_0);
    typeView = new (require(`./views/code`))({ resource, config });
  }

  config.content = resource.content;

  if (Array.isArray(config.locals.append)) {
    config.content += await renderAppendices(
      config.locals.append,
      requestData.path
    );
  }
  config.ext = resource.info.ext;
  config.base = resource.info.base;

  if (typeof config.readOnly !== "boolean") {
    config.readOnly = false;
  }

  config.locals = Object.assign({}, config.locals, config.queryValue);

  resource.info.ext = ".html";
  resource.content = `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title id='title'>${
    config.title || `${resource.info.dir}/${resource.info.base}`
  }</title>
  <link rel="icon" href="data:;base64,iVBORw0KGgo=">

  ${await typeView.styles()}

  ${await typeView.scriptsHead()}

  ${renderDependencies(config.locals.dependencies, resource)}


</head>

<body>

  <section>
    <div class="dropdown">
      <strong><code>&#187; OPTIONS &#171;</code></strong>
      <div class='dropdown-content'>
        <div class='selection-buttons'>
          <a href='?--help' target='_blank'><code>--help</code>!  what is this?</a>
          <a href='?--sandbox=js' target='_blank'><button>js editor</button></a>
          <a href='?--repl' target='_blank'><button>js repl</button></a>
          <a href='?--sandbox=html' target='_blank'><button>html</button></a>
          <a href='?--draw' target='_blank'><button>whiteboard</button></a>
        </div>
        ${await typeView.configOptions()}
      </div>
    </div>
    ${await typeView.panel()}
  </section>
  <main>
    ${await typeView.code()}
  </main>

  ${await typeView.configScript()}

  ${await typeView.scriptsBody()}

  <script type='module' src='${
    config.ownStatic
  }/types/${type}/init.js'></script>


</body>

</html>
`;

  return {
    resource,
  };
};

module.exports = liveStudyLense;
