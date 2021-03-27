"use strict";

const path = require("path");

const loadPlugins = require("./load-plugins");
const configurePlugins = require("./configure-plugins");

const lensesPath = path.join(__dirname, "..", "lenses");
const lensesPromise = loadPlugins("lenses", lensesPath);

const sandbox = async (req, res, next) => {
  if (!req.query.hasOwnProperty("--sandbox")) {
    next();
    return;
  }
  const studyLens = (await lensesPromise).find(
    (lens) => lens.queryKey === "study"
  );
  studyLens.requested = true;

  const sandboxQuery = req.query["--sandbox"];
  const ext = /html/i.test(sandboxQuery)
    ? ".html"
    : /js/i.test(sandboxQuery) || /javascript/i.test(sandboxQuery)
    ? ".js"
    : ".js";

  const configuredStudyLens = configurePlugins(
    [studyLens],
    {
      study: {
        save: false,
        eval: true,
        loopGuard: { active: false, max: 100 },
        flowchart: true,
        variables: true,
        trace: true,
      },
    },
    { study: "" }
  )[0];

  configuredStudyLens.title = ext + " sandbox";

  const content =
    ext === ".html"
      ? `<html lang="">
  <head>
    <meta charset="utf-8" />
    <title></title>

    <style></style>
  </head>

  <body>
    <div></div>
    <script></script>
  </body>
</html>`
      : ext === ".js"
      ? ""
      : "";

  const { resource } = await configuredStudyLens.module({
    resource: {
      info: {
        ext,
      },
      content,
    },
    config: configuredStudyLens,
  });

  res.set("Content-Type", "text/html");

  res.send(resource.content);
};

module.exports = sandbox;
