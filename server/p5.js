'use strict';

const path = require('path');

const loadPlugins = require('./load-plugins');
const configurePlugins = require('./configure-plugins');

const lensesPath = path.join(__dirname, '..', 'lenses');
const lensesPromise = loadPlugins('lenses', lensesPath);

const p5Option = async (req, res, next) => {
  if (!req.query.hasOwnProperty('--p5')) {
    next();
    return;
  }
  const p5Lens = (await lensesPromise).find(
    (lens) => lens.queryKey === 'study',
  );
  p5Lens.requested = true;

  const configuredStudyLens = configurePlugins(
    [p5Lens],
    {
      study: {
        save: false,
      },
    },
    { study: 'p5' },
  )[0];

  configuredStudyLens.title = 'P5.js sandbox';

  const { resource } = await configuredStudyLens.module({
    resource: {
      info: {
        ext: '.js',
        base: '.js',
      },
      content: `/*
  https://p5js.org/reference/
  https://p5js.org/examples/
*/

function setup(){
  createCanvas(700, 500);
}

function draw() {
  background(220);
}`,
    },
    config: configuredStudyLens,
  });

  res.set('Content-Type', 'text/html');

  res.send(resource.content);
};

module.exports = p5Option;
