"use strict";

const path = require("path");
const fs = require("fs");
const util = require("util");
const writeFilePromise = util.promisify(fs.writeFile);
const readFilePromise = util.promisify(fs.readFile);

const renderCards = require("./render-cards");
const registerCards = require("./lib/register-cards");

const leitnerLens = async ({ config, resource, responseData, requestData }) => {
  const dirPath = path.join(
    resource.info.root,
    resource.info.dir,
    resource.info.base
  );
  const leitnerPath = path.join(dirPath, "leitner.json");

  if (requestData.method === "POST") {
    try {
      await writeFilePromise(
        leitnerPath,
        JSON.stringify(requestData.body, null, "  ")
      );
      resource.content = ": changes were saved";
      resource.info.ext = ".txt";

      return {
        resource,
      };
    } catch (err) {
      console.error(err);
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

  if (resource.content === null || resource.info === null || resource.error) {
    return;
  }

  if (resource.info && resource.info.ext === ".md") {
    return renderCard({ config, resource });
  }

  if (resource.info.type !== "directory") {
    return;
  }

  let leitner;
  try {
    leitner = JSON.parse(await readFilePromise(leitnerPath, "utf-8"));
  } catch (err) {
    // console.error(err);
    leitner = {
      boxes: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
      },
    };
  }

  await registerCards(dirPath, leitner.boxes);

  await writeFilePromise(leitnerPath, JSON.stringify(leitner, null, "  "));

  return renderCards({ config, resource, leitner });
};

module.exports = leitnerLens;
