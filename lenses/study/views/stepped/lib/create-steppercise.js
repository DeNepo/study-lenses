const fs = require("fs");
const path = require("path");

const util = require("util");
const readFilePromise = util.promisify(fs.readFile);
const readDirPromise = util.promisify(fs.readdir);

const marked = require("marked");
const prettier = require("prettier");

const createSteppercise = async ({ resource, config }) => {
  const stepsExt = config.stepsExt;
  const name = resource.info.base.replace(/-./g, (x) => x[1].toUpperCase());

  const basePath = path.join(
    resource.info.root,
    resource.info.dir,
    resource.info.base
  );

  let readme = null;
  const readmePath = path.join(basePath, "README.md");
  if (fs.existsSync(readmePath)) {
    readme = await readFilePromise(readmePath, "utf-8");
  }

  let renderedReadme = "";
  if (readme !== null) {
    const baseUrl = `./${`${resource.info.dir}/${resource.info.base}`
      .split(path.sep)
      .join("/")}`;

    marked.setOptions({
      baseUrl,
      langPrefix: "line-numbers language-",
    });

    renderedReadme = `<div class='markdown-body'>${marked(
      prettier.format(readme, { parser: "markdown", proseWrap: "never" })
    )}</div>`;
  }

  const steps = [];
  const stepsPath = path.join(basePath);
  if (fs.existsSync(stepsPath) && fs.lstatSync(stepsPath).isDirectory()) {
    const stepFileNames = (await readDirPromise(stepsPath)).filter((entity) =>
      entity.endsWith(stepsExt)
    );
    if (stepFileNames.length === 0) {
      steps.unshift({
        fileName: "oops!",
        name: "oops!",
        code: `there are no ${stepsExt} files in this directory!`,
      });
    } else {
      const stepCodes = await Promise.all(
        stepFileNames.map((fileName) =>
          readFilePromise(path.join(stepsPath, fileName), "utf-8")
        )
      );
      stepFileNames
        .filter((fileName) => fileName.endsWith(stepsExt))
        .forEach((fileName, index) => {
          const name = fileName
            .replace(/-./g, (x) => x[1].toUpperCase())
            .replace(stepsExt, "");
          steps.unshift({
            fileName,
            name,
            code: stepCodes[index].split("__name__").join(name),
          });
        });
    }
  }

  steps.sort().reverse();

  return {
    name,
    // https://dev.to/mattkenefick/snippets-in-javascript-converting-pascalcase-to-kebab-case-36ed
    folderName: name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
    readme,
    renderedReadme,
    steps,
    locals: config.locals,
    stepsExt,
  };
};

module.exports = createSteppercise;
