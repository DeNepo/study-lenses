'use strict';

const path = require('path');

const loadPlugins = require('./load-plugins');
const configurePlugins = require('./configure-plugins');

const lensesPath = path.join(__dirname, '..', 'lenses');
const lensesPromise = loadPlugins('lenses', lensesPath);

const repl = async (req, res, next) => {
  if (!req.query.hasOwnProperty('--repl')) {
    next();
    return;
  }
  const replLens = (await lensesPromise).find(
    (lens) => lens.queryKey === 'repl',
  );
  replLens.requested = true;

  const ext = '.js';

  const configuredReplLens = configurePlugins(
    [replLens],
    {
      repl: {},
    },
    { study: '' },
  )[0];

  configuredReplLens.title = ext + ' sandbox';

  const content = '';

  const { resource } = await configuredReplLens.module({
    resource: {
      info: {
        ext,
      },
      content,
    },
    config: configuredReplLens,
  });

  res.set('Content-Type', 'text/html');

  res.send(resource.content);
};

module.exports = repl;
