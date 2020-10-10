const path = require('path');
const { convertCodeToSvg } = require('js2flowchart');

const flowchartLense = async (simpReq, resource, config) => {
  const { absPath } = resource;

  if (path.extname(absPath) !== '.js') {
    return resource;
  }

  try {
    resource.content = convertCodeToSvg(resource.content);
    resource.mime = 'image/svg+xml';
  } catch (err) {
    resource.content = err.name + ': ' + err.message + '\n\n- - - - - - - - - - - - - -\n\n' + resource.content;
    resource.mime = 'text/plain';
    resource.status = 500;
    console.error(err);
  }

  return resource;
};

module.exports = flowchartLense;
