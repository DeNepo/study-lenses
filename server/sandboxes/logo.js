'use strict';

const path = require('path');

const loadPlugins = require('../load-plugins');
const configurePlugins = require('../configure-plugins');

const lensesPath = path.join(__dirname, '..', '..', 'lenses');
const lensesPromise = loadPlugins('lenses', lensesPath);

const logoOption = async (req, res, next) => {
  if (!req.query.hasOwnProperty('--logo')) {
    next();
    return;
  }
  const logoLens = (await lensesPromise).find(
    (lens) => lens.queryKey === 'logo',
  );
  logoLens.requested = true;

  const configuredStudyLens = configurePlugins(
    [logoLens],
    {
      logo: {
        save: false,
      },
    },
    { logo: {} },
  )[0];

  configuredStudyLens.title = 'logo sandbox';

  const { resource } = await configuredStudyLens.module({
    resource: {
      info: {
        ext: '.lgo',
        base: '.lgo',
      },
      content: `color #ffaba9

repeat 42 [
  lt 17
  pu
  fd 1
  pd
  repeat 120 [
    fd 2
    rt 3
  ]
]

`,
    },
    config: configuredStudyLens,
  });

  res.set('Content-Type', 'text/html');

  res.send(resource.content);
};

module.exports = logoOption;
