"use strict";

const path = require("path");

const loadPlugins = require("../../server/load-plugins");
const configurePlugins = require("../../server/configure-plugins");

const lensesPath = path.join(__dirname, "..");
const lensesPromise = loadPlugins("lenses", lensesPath);

const p5Lens = async ({ resource }) => {
  if (resource.info.ext !== ".js") {
    return;
  }

  const studyLens = (await lensesPromise).find(
    (lens) => lens.queryKey === "study"
  );
  studyLens.requested = true;

  const configuredStudyLens = configurePlugins(
    [studyLens],
    {
      study: {},
    },
    { study: "" }
  )[0];

  // because hack
  resource.info.base = ".p5.";

  const { newResource = resource } = await configuredStudyLens.module({
    resource,
    config: configuredStudyLens,
  });

  return {
    resource: newResource,
  };
};

module.exports = p5Lens;
