/*



things i did not finish last night
- load docs into plugins as well in server/load-plugins
- pass a copy of lenses into each lens/option
- use that in the help


*/

'use strict';

const pingOption = async ({ config, resource, lenses, options }) => {
  // console.log("docs!");

  if (resource.info) {
    resource.info.ext = '.txt';
  } else {
    resource.info = { ext: '.txt' };
  }

  resource.content = 'pong';

  return {
    resource,
  };
};

module.exports = pingOption;
