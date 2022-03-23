'use strict';

const path = require('path');

const config = require('config');

const loadPlugins = require('./load-plugins');
const configurePlugins = require('./configure-plugins');
const compileLocalConfigs = require('./compile-local-configs');

const lensesPath = path.join(__dirname, '..', 'lenses');
const lensesPromise = loadPlugins('lenses', lensesPath);

const deepMerge = require('deepmerge');
const combineMerge = (target, source, options) => {
  const destination = target.slice();

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
    } else if (options.isMergeableObject(item)) {
      const alreadyExists = destination.some((entry) =>
        util.isDeepStrictEqual(entry, item),
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

const sandbox = async (req, res, next) => {
  if (
    !req.query.hasOwnProperty('--sandbox') &&
    !req.query.hasOwnProperty('--js') &&
    !req.query.hasOwnProperty('--html')
  ) {
    next();
    return;
  }

  const absolutePath = path.join(process.cwd(), req.path);
  const preDefaults = compileLocalConfigs(absolutePath, {
    study: {
      save: false,
      eval: true,
      flowchart: true,
      variables: true,
      environment: true,
    },
  });
  const localConfigs = deepMerge(config.locals, preDefaults, {
    arrayMerge: combineMerge,
  });

  localConfigs.save = false;

  const studyLens = (await lensesPromise).find(
    (lens) => lens.queryKey === 'study',
  );
  studyLens.requested = true;

  const sandboxQuery = req.query['--sandbox'];
  const ext = req.query.hasOwnProperty('--js')
    ? '.js'
    : req.query.hasOwnProperty('--html')
    ? '.html'
    : /html/i.test(sandboxQuery)
    ? '.html'
    : /js/i.test(sandboxQuery) || /javascript/i.test(sandboxQuery)
    ? '.js'
    : '.js';

  const configuredStudyLens = configurePlugins([studyLens], localConfigs, {
    study: '',
  })[0];

  configuredStudyLens.title = ext + ' sandbox';

  const content =
    ext === '.html'
      ? `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title></title>

    <style></style>
  </head>

  <body>
    <div id="root"></div>

    <script></script>
  </body>
</html>
`
      : ext === '.js'
      ? ''
      : '';

  const { resource } = await configuredStudyLens.module({
    resource: {
      info: {
        ext,
      },
      content,
    },
    config: configuredStudyLens,
  });

  res.set('Content-Type', 'text/html');

  res.send(resource.content);
};

module.exports = sandbox;
