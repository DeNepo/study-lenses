'use strict';

const path = require('path');
const fs = require('fs');

const config = require('config');

const mime = require('mime');

const { version } = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'),
);

const deepClone = require('./lib/deep-clone.js');
const deepParseQuery = require('./lib/deep-parse-query.js');

const compileLocalConfigs = require('./compile-local-configs');
const resourceFromAbsolutePath = require('./resource-from-absolute-path');
const changePerspective = require('./change-perspective');
const loadPlugins = require('./load-plugins');

const optionsPath = path.join(__dirname, '..', 'options');
const optionsPromise = loadPlugins('options', optionsPath);

const lensesPath = path.join(__dirname, '..', 'lenses');
const lensesPromise = loadPlugins('lenses', lensesPath);

const localLensesPath = path.join(process.cwd(), '.study-lenses');
const localLensesPromise = loadPlugins('local_lenses', localLensesPath);

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

const configurePlugins = require('./configure-plugins');

module.exports = async (req, res, next) => {
  // if the requested resource does not exist, fall back to static serving
  const isPublicExample = /[\s\S]*study_lenses_public/.test(req.path);
  const absolutePath = path.normalize(
    isPublicExample
      ? path.join(
          __dirname,
          '..',
          'study_lenses_public',
          req.path.replace(/[\s\S]*study_lenses_public/, ''),
        )
      : path.join(process.cwd(), req.path),
  );
  if (!fs.existsSync(absolutePath)) {
    next();
    return;
  }
  // console.log(1);

  // be forgiving of white space in URL lens parameters
  for (const key in req.query) {
    const trimmedKey = key.trim();
    req.query[trimmedKey] = req.query[key];
    if (trimmedKey !== key) {
      delete req.query[key];
    }
  }

  // build the local configuration for this request path
  //  all study.json combined from the request path
  //  up to the cwd, then the module's defaults
  const preDefaults = compileLocalConfigs(absolutePath, {});
  const localConfigs = deepMerge(config.locals, preDefaults, {
    arrayMerge: combineMerge,
  });
  // the there is a local --ignore option, fall back to static serving
  if (localConfigs['--ignore']) {
    next();
    return;
  }
  // console.log(2);

  // if there are no parameters and localc configs don't include --force
  //  fall back to static serving
  if (Object.keys(req.query).length === 0 && localConfigs['--force'] !== true) {
    next();
    return;
  } else if (
    localConfigs['--force'] === true &&
    Object.keys(req.query).length === 0
  ) {
    req.query['--defaults'] = '';
  }
  // console.log(3);

  const queryKeys = Object.keys(req.query);
  // if the 'ignore' option is set for this request, fall back to static serving
  if (queryKeys.includes('--ignore')) {
    next();
    return;
  }
  // console.log(4);

  // set defaults if requested
  if (queryKeys.includes('--defaults')) {
    const pathExt = path.extname(req.path);
    let localDefaultsConfig = '';
    if (fs.lstatSync(absolutePath).isDirectory()) {
      localDefaultsConfig = localConfigs['--defaults'].directory;
    } else {
      localDefaultsConfig = localConfigs['--defaults'][pathExt] || '';
    }
    if (!localDefaultsConfig) {
      next();
      return;
    }
    const splitLocalDefaultsConfig = localDefaultsConfig.split('&');
    const parsedLocalDefaultsConfigs = splitLocalDefaultsConfig.map((param) => {
      const key = param.split('=')[0];
      const value = param.split('=')[1];
      if (value) {
        let parsedValue = value.replace(/\+/g, ' ');
        try {
          parsedValue = JSON.parse(value);
        } catch (o_0) {}
        return [key, parsedValue];
      } else {
        return [key, ''];
      }
    });

    for (const paramConfig of parsedLocalDefaultsConfigs) {
      req.query[paramConfig[0]] = paramConfig[1];
    }
  }

  // deeply parse any parameter configurations
  req.query = deepParseQuery(req.query);

  // filter for the requested plugins (url params)
  //  configure them with local & param configurations
  const unconfiguredOptions = await optionsPromise;
  const unconfiguredLenses = [
    ...(await lensesPromise),
    ...(await localLensesPromise),
  ];
  const options = configurePlugins(
    unconfiguredOptions,
    localConfigs,
    req.query,
  );
  const lenses = [];
  const builtinLenses = configurePlugins(
    unconfiguredLenses,
    localConfigs,
    req.query,
  );
  if (builtinLenses) {
    lenses.push(...builtinLenses);
  }

  // console.log(options, lenses);

  // if the parameters were not valid options or lenses
  //  fallback to static serving
  if (!options && !lenses) {
    next();
    return;
  }

  // did the URL contain a resource?
  const resourceProvided =
    req.query['--resource'] &&
    req.query['--resource'].resource &&
    typeof req.query['--resource'].resource === 'object';
  // console.log(resourceProvided);
  // should it be merged with the local resource?
  const mergeWithLocalResource =
    resourceProvided && req.query['--resource'].merge;
  // console.log(mergeWithLocalResource);

  // build the requested resource
  let resource = {};
  if (resourceProvided && mergeWithLocalResource) {
    // console.log("++ merge");
    const localResource = await resourceFromAbsolutePath({
      absolutePath,
      localConfigs,
    });
    resource = deepMerge(localResource, req.query['--resource'].resource, {
      arrayMerge: combineMerge,
    });
  } else if (resourceProvided && !mergeWithLocalResource) {
    // console.log("++ not merge");
    resource = req.query['--resource'].resource;
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

  const { finalResponseData, finalResource, abort, error } =
    await changePerspective({
      lenses,
      options,
      resource,
      requestData,
      responseData,
    });

  if (abort) {
    console.log(': aborting at ' + abort);
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

  const mimeType = mime.getType(finalResource.info.ext) || 'text/plain';
  res.set('Content-Type', mimeType);
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
};
