"use strict";

const path = require("path");

const loadPlugins = require("./load-plugins");
const configurePlugins = require("./configure-plugins");

const lensesPath = path.join(__dirname, "..", "lenses");
const lensesPromise = loadPlugins("lenses", lensesPath);

const draw = async (req, res, next) => {
  if (!req.query.hasOwnProperty("--draw")) {
    next();
    return;
  }
  const highlightLens = (await lensesPromise).find(
    (lens) => lens.queryKey === "highlight"
  );
  highlightLens.requested = true;

  const configuredHighlightLens = configurePlugins(
    [highlightLens],
    {
      highlight: {
        save: false,
        eval: false,
        loopGuard: false,
        flowchart: false,
        variables: false,
        trace: false,
        color: "black",
        randomLine: false,
        code: false,
      },
    },
    { highlight: "" }
  )[0];

  configuredHighlightLens.title = "drawing things";

  const { resource } = await configuredHighlightLens.module({
    resource: {
      info: {
        ext: ".js",
      },
      content: "",
    },
    config: configuredHighlightLens,
  });

  res.set("Content-Type", "text/html");

  res.send(resource.content);
};

module.exports = draw;
