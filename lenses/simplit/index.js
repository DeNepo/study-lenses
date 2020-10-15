module.exports = () => { }

// const fs = require('fs');

// const path = require('path');

// const mimes = require('local-modules').mime;

// const simplit = require('./simplit.js');

// const simplitLense = async ({ resource }) => {

//   if (resource.info.ext !== '.md') {
//     return
//   }


//   const embeddedPath = absPath.replace(new RegExp('.md$'), '');
//   const embeddedExtension = path.extname(embeddedPath);
//   if (embeddedExtension === '') {
//     // it is not a simplit file
//     return resource;
//   }

//   // refactor the simplit parser to take just the codefence language name
//   //  handle extension parsing here
//   resource.content = simplit(absPath, resource.content);
//   resource.mime = mimes[embeddedExtension];
//   resource.absPath = absPath.replace(new RegExp('.md$'), '');
//   resource.relPath = relPath.replace(new RegExp('.md$'), '');

//   return resource
// };

// module.exports = simplitLense;
