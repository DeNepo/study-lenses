
const { convertCodeToSvg } = require('js2flowchart');

const flowchartLense = async ({ responseData, resource }) => {

  if (resource.info.ext !== '.js') {
    return
  }

  try {
    resource.content = convertCodeToSvg(resource.content);
    resource.info.ext = '.svg';
  } catch (err) {
    resource.content = err.name + ': ' + err.message + '\n\n- - - - - - - - - - - - - -\n\n' + resource.content;
    resource.info.ext = '.txt';
    responseData.status = 500;
    console.error(err);
  }

  return {
    resource,
    responseData
  }
};

module.exports = flowchartLense;
