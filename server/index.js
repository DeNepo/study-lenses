'use strict';

// start an express server, pretty standard stuff

// dependencies & config ...
const path = require('path');
const fs = require('fs');
const util = require('util');
const readFilePromise = util.promisify(fs.readFile);

process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '..', 'config');
const config = require('config');

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const marked = require('marked');

const Logger = require('./lib/logger.js');
const study = require('./study.js');
const sandbox = require('./sandbox.js');
const repl = require('./repl.js');
const p5 = require('./p5.js');
const tutor = require('./tutor.js');

// error and exit handling ...
process.on('exit', function onExit(code) {
  Logger.info(`process.exit with code ${code}`);
});

process.on('SIGINT', function onSIGINT() {
  Logger.info('SIGINT received, stopping server');
  process.exit(0);
});

process.on('uncaughtException', function onUncaughtException(e) {
  Logger.error('uncaughtException', e);
  process.exit(99);
});

process.on('unhandledRejection', function onUnhandledPromise(e) {
  Logger.error('unhandledRejection', e);
  process.exit(99);
});

// initialize express ...
const app = express();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(sandbox);
app.use(repl);
app.use(p5);
app.use(tutor);

app.use(
  /[\s\S]*own_static_resources_lenses/,
  express.static(path.join(__dirname, '..', 'lenses')),
);
app.use(
  /[\s\S]*own_static_resources_local_lenses/,
  express.static(path.join(process.cwd(), '.study-lenses')),
);
app.use(
  /[\s\S]*own_static_resources_options/,
  express.static(path.join(__dirname, '..', 'options')),
);
app.use(
  /[\s\S]*shared_static_resources/,
  express.static(path.join(__dirname, '..', 'static')),
);
app.use(
  /[\s\S]*shared_components/,
  express.static(path.join(__dirname, '..', 'static', 'web-components')),
);
app.use(
  /[\s\S]*sl_web_components/,
  express.static(path.join(__dirname, '..', 'static', 'web-components')),
);
app.use(
  /[\s\S]*sl_prism/,
  express.static(path.join(__dirname, '..', 'static', 'prism')),
);

if (config.locals.static && typeof config.locals.static === 'object') {
  for (const staticPath in config.locals.static) {
    const actualPath = config.locals.static[staticPath];
    app.use(
      new RegExp(`[\s\S]*${staticPath}`),
      express.static(path.join(process.cwd(), actualPath)),
    );
  }
}

app.use(study);

app.use(
  /[\s\S]*study_lenses_public/,
  express.static(path.join(__dirname, '..', 'study_lenses_public')),
);

// if they requested a directory, send index.html or rendered README
// otherwise fallback to static serving (so 404)
// - should this stay?
app.use(async (req, res, next) => {
  // continue to static serving if it's not a directory
  const absolutePath = path.join(process.cwd(), req.path);
  const isDirectory =
    fs.existsSync(absolutePath) && fs.lstatSync(absolutePath).isDirectory();
  if (!isDirectory) {
    next();
    return;
  }

  // send index.html if there is one
  const indexHtmlPath = path.join(absolutePath, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    const indexHtml = await readFilePromise(indexHtmlPath, 'utf-8');
    res.set('Content-Type', 'text/html');
    res.status(200);
    res.send(indexHtml);
    return;
  }

  // render readme if there is one
  const readmeMdPath = path.join(absolutePath, 'readme.md');
  if (fs.existsSync(readmeMdPath)) {
    const rawMarkdown = await readFilePromise(readmeMdPath, 'utf-8');
    const renderedMarkdown = `
      <!DOCTYPE html>
        <html>
        <head>
          <link rel="stylesheet" href="shared_static_resources/gh-styles.css">
          <link rel="stylesheet" href="shared_static_resources/prism/style.css">
        </head>
        <body>
          <main class="markdown-body">${marked(rawMarkdown, {
            baseUrl: `/../${req.path}/`,
          })}</main>
          <script src="shared_static_resources/prism/script.js"></script>
        </body>
      </html>`;
    // in case it works by side-effect, reset for later

    res.set('Content-Type', 'text/html');
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
