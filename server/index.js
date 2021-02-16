"use strict";

// start an express server, pretty standard stuff

// dependencies & config ...
const path = require("path");
const querystring = require("querystring");
const fs = require("fs");
const util = require("util");
const readFilePromise = util.promisify(fs.readFile);

process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "..", "config");
const config = require("config");

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mime = require("mime");
const marked = require("marked");

const deepClone = require("./lib/deep-clone.js");
const deepParseQuery = require("./lib/deep-parse-query.js");

const compileLocalConfigs = require("./compile-local-configs");
const resourceFromAbsolutePath = require("./resource-from-absolute-path");
const changePerspective = require("./change-perspective");
const loadPlugins = require("./load-plugins");

const optionsPath = path.join(__dirname, "..", "options");
const optionsPromise = loadPlugins("options", optionsPath);

const lensesPath = path.join(__dirname, "..", "lenses");
const lensesPromise = loadPlugins("lenses", lensesPath);

let localLensesPromise = null;
let localLensesPath = "";
let localLensesPathIsValid = false;
// console.log(config.locals)
if (typeof config.locals["--local-lenses"] === "string") {
  // console.log(config.locals['--local-lenses'])
  localLensesPath = path.join(process.cwd(), config.locals["--local-lenses"]);
  // console.log(localLensesPath)
  if (
    !fs.existsSync(localLensesPath) ||
    !fs.lstatSync(localLensesPath).isFile()
  ) {
    localLensesPathIsValid = true;
    localLensesPromise = loadPlugins("local_lenses", localLensesPath);
    // localLensesPromise.then(console.log)
  } else {
    localLensesPath = "";
  }
}

const deepMerge = require("deepmerge");
const combineMerge = (target, source, options) => {
  const destination = target.slice();

  source.forEach((item, index) => {
    if (typeof destination[index] === "undefined") {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
    } else if (options.isMergeableObject(item)) {
      const alreadyExists = destination.some((entry) =>
        util.isDeepStrictEqual(entry, item)
      );
      if (!alreadyExists) {
        destination.push(item);
      } else {
        destination[index] = deepMerge(target[index], item, options);
      }
    } else if (target.indexOf(item) === -1) {
      destination.push(item);
    }
  });
  return destination;
};

const configurePlugins = require("./configure-plugins");

const gitbookify = require("./gitbookify/index.js");

const Logger = require("./lib/logger.js");
const gitbookfiy = require("./gitbookify/index.js");
const { query } = require("./lib/logger.js");
// const Logger = console

// error and exit handling ...
process.on("exit", function onExit(code) {
  Logger.info(`process.exit with code ${code}`);
});

process.on("SIGINT", function onSIGINT() {
  Logger.info("SIGINT received, stopping server");
  process.exit(0);
});

process.on("uncaughtException", function onUncaughtException(e) {
  Logger.error("uncaughtException", e);
  process.exit(99);
});

process.on("unhandledRejection", function onUnhandledPromise(e) {
  Logger.error("unhandledRejection", e);
  process.exit(99);
});

// initialize express ...
const app = express();

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  /[\s\S]*own_static_resources_lenses/,
  express.static(path.join(__dirname, "..", "lenses"))
);
app.use(
  /[\s\S]*own_static_resources_options/,
  express.static(path.join(__dirname, "..", "options"))
);
app.use(
  /[\s\S]*shared_static_resources/,
  express.static(path.join(__dirname, "..", "static"))
);
if (localLensesPathIsValid) {
  app.use(
    /[\s\S]*own_static_resources_local_lenses/,
    express.static(localLensesPath)
  );
}

if (config.locals.static && typeof config.locals.static === "object") {
  for (const staticPath in config.locals.static) {
    const actualPath = config.locals.static[staticPath];
    app.use(
      new RegExp(`[\s\S]*${staticPath}`),
      express.static(path.join(process.cwd(), actualPath))
    );
  }
}

app.use(async (req, res, next) => {
  // if the requested resource does not exist, fall back to static serving
  const isPublicExample = /[\s\S]*public_example_files/.test(req.path);
  const absolutePath = isPublicExample
    ? path.join(
        __dirname,
        "..",
        "public-example-files",
        req.path.replace(/[\s\S]*public_example_files/, "")
      )
    : path.join(process.cwd(), req.path);
  if (!fs.existsSync(absolutePath)) {
    next();
    return;
  }
  // console.log(1);

  // build the local configuration for this request path
  //  all study.json combined from the request path
  //  up to the cwd, then the module's defaults
  const preDefaults = compileLocalConfigs(absolutePath, {});
  const localConfigs = deepMerge(config.locals, preDefaults, {
    arrayMerge: combineMerge,
  });
  // the there is a local --ignore option, fall back to static serving
  if (localConfigs["--ignore"]) {
    next();
    return;
  }
  // console.log(2);

  // if there are no parameters and localc configs don't include --force
  //  fall back to static serving
  if (Object.keys(req.query).length === 0 && localConfigs["--force"] !== true) {
    next();
    return;
  } else if (
    localConfigs["--force"] === true &&
    Object.keys(req.query).length === 0
  ) {
    req.query["--defaults"] = "";
  }
  // console.log(3);

  const queryKeys = Object.keys(req.query);
  // if the 'ignore' option is set for this request, fall back to static serving
  if (queryKeys.includes("--ignore")) {
    next();
    return;
  }
  // console.log(4);

  // deeply parse any parameter configurations
  req.query = deepParseQuery(req.query);

  // set defaults if requested
  if (queryKeys.includes("--defaults")) {
    const pathExt = path.extname(req.path);
    let localDefaultsConfig = "";
    if (fs.lstatSync(absolutePath).isDirectory()) {
      localDefaultsConfig = localConfigs["--defaults"].directory;
    } else {
      localDefaultsConfig = localConfigs["--defaults"][pathExt] || "";
    }
    if (!localDefaultsConfig) {
      next();
      return;
    }
    const splitLocalDefaultsConfig = localDefaultsConfig.split("&");
    const parsedLocalDefaultsConfigs = splitLocalDefaultsConfig.map((param) => {
      const key = param.split("=")[0];
      const value = param.split("=")[1];
      if (value) {
        let parsedValue = value;
        try {
          parsedValue = JSON.parse(value);
        } catch (o_0) {}
        return [key, parsedValue];
      } else {
        return [key, ""];
      }
    });
    for (const paramConfig of parsedLocalDefaultsConfigs) {
      req.query[paramConfig[0]] = paramConfig[1];
    }
  }

  // filter for the requested plugins (url params)
  //  configure them with local & param configurations
  const unconfiguredOptions = await optionsPromise;
  const unconfiguredLenses = await lensesPromise;
  const options = configurePlugins(
    unconfiguredOptions,
    localConfigs,
    req.query
  );
  const lenses = [];
  const builtinLenses = configurePlugins(
    unconfiguredLenses,
    localConfigs,
    req.query
  );
  if (builtinLenses) {
    lenses.push(...builtinLenses);
  }
  const localLenses = configurePlugins(
    await localLensesPromise,
    localConfigs,
    req.query
  );
  if (localLenses) {
    lenses.push(...localLenses);
  }

  // if the parameters were not valid options or lenses
  //  fallback to static serving
  if (!options && !lenses) {
    next();
    return;
  }

  // did the URL contain a resource?
  const resourceProvided =
    req.query["--resource"] &&
    req.query["--resource"].resource &&
    typeof req.query["--resource"].resource === "object";
  // console.log(resourceProvided);
  // should it be merged with the local resource?
  const mergeWithLocalResource =
    resourceProvided && req.query["--resource"].merge;
  // console.log(mergeWithLocalResource);

  // build the requested resource
  let resource = {};
  if (resourceProvided && mergeWithLocalResource) {
    // console.log("++ merge");
    const localResource = await resourceFromAbsolutePath({
      absolutePath,
      localConfigs,
    });
    resource = deepMerge(localResource, req.query["--resource"].resource, {
      arrayMerge: combineMerge,
    });
  } else if (resourceProvided && !mergeWithLocalResource) {
    // console.log("++ not merge");
    resource = req.query["--resource"].resource;
  } else {
    // console.log("++ local");
    resource = await resourceFromAbsolutePath({
      absolutePath,
      localConfigs,
    });
  }

  // if there was an error fetching the resource
  //  fallback to static serving
  // express.static can handle the error
  if (resource.error) {
    next();
    return;
  }

  const requestData = {
    path: req.path,
    method: req.method,
    body: deepClone(req.body),
    headers: deepClone(req.headers),
    cookies: deepClone(req.cookies),
  };
  const responseData = {
    status: 200,
    headers: {},
    cookies: {},
    // body is not included
    //  it will be constructed from the finalResource
  };

  const {
    finalResponseData,
    finalResource,
    abort,
    error,
  } = await changePerspective({
    lenses,
    options,
    resource,
    requestData,
    responseData,
  });

  if (abort) {
    console.log(": aborting at " + abort);
    next();
    return;
  }

  // handle the error
  if (error) {
    // send?
    // fallback to static?
    console.error(error);
    next();
    return;
  }

  const mimeType = mime.getType(finalResource.info.ext);
  res.set("Content-Type", mimeType);
  res.status(finalResponseData.status);

  if (finalResponseData.headers) {
    for (const key in finalResponseData.headers) {
      res.set(key, finalResponseData.headers[key]);
    }
  }

  if (finalResponseData.cookies) {
    for (const key in finalResponseData.cookies) {
      res.set(key, finalResponseData.cookies[key]);
    }
  }

  res.send(finalResource.content);
});

app.use(
  /[\s\S]*public_example_files/,
  express.static(path.join(__dirname, "..", "public-example-files"))
);

// if they requested a directory, send index.html or rendered README
// otherwise fallback to static serving (so 404)
app.use(async (req, res, next) => {
  // continue to static serving if it's not a directory
  const absolutePath = path.join(process.cwd(), req.path);
  const isDirectory =
    fs.existsSync(absolutePath) && fs.lstatSync(absolutePath).isDirectory();
  if (!isDirectory) {
    next();
    return;
  }

  // render like a gitbook if there is a Summary.md
  const summaryMdPath = path.join(absolutePath, "summary.md");
  if (fs.existsSync(summaryMdPath)) {
    const readmeMdPath = path.join(absolutePath, "readme.md");
    const readmeExists = fs.existsSync(readmeMdPath);
    const rawMarkdown = await readFilePromise(summaryMdPath, "utf-8");
    const renderedMarkdown = gitbookfiy(rawMarkdown, readmeExists);
    res.set("Content-Type", "text/html");
    res.status(200);
    res.end(renderedMarkdown);
    return;
  }

  // send index.html if there is one
  const indexHtmlPath = path.join(absolutePath, "index.html");
  if (fs.existsSync(indexHtmlPath)) {
    const indexHtml = await readFilePromise(indexHtmlPath, "utf-8");
    res.set("Content-Type", "text/html");
    res.status(200);
    res.send(indexHtml);
    return;
  }

  // render readme if there is one
  const readmeMdPath = path.join(absolutePath, "readme.md");
  if (fs.existsSync(readmeMdPath)) {
    const rawMarkdown = await readFilePromise(readmeMdPath, "utf-8");
    const renderedMarkdown = `
      <!DOCTYPE html>
        <html>
        <head>
          <link rel="stylesheet" href="shared_static_resources/gh-styles.css">
          <link rel="stylesheet" href="shared_static_resources/prism/style.css">
        </head>
        <body>
          <main class="markdown-body">${marked(rawMarkdown)}</main>
          <script src="shared_static_resources/prism/script.js"></script>
        </body>
      </html>`;
    res.set("Content-Type", "text/html");
    res.status(200);
    res.end(renderedMarkdown);
    return;
  }

  // if there wasn't an index.html, SUMMARY.md, or README, go on to static serving
  next();
});

// all-time fallback - be a static server from cwd
app.use(express.static(process.cwd()));

// launch the app
// to open browser after success
const serverPromiseCloser = (PORT) =>
  new Promise((resolve, reject) => {
    app.listen(PORT, (err) => {
      if (err) {
        Logger.error(`Failed to start server on port: ${PORT}`, err);
        process.exit(1);
      }

      Logger.info(`Server started successfully on port: ${PORT}`);
      resolve();
    });
  });

module.exports = serverPromiseCloser;

/*
  go to ./handle-request/index.js for the next step in your journey
*/
