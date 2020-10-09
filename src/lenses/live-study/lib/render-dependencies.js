const path = require('path');

path.i

const renderDependencies = (dependencies) => {
  return dependencies
    .map(dependency => {
      let tagString = `<script `;
      if (dependency.module) {
        tagString += 'type="module" ';
      }
      if (dependency.absolute) {
        tagString += `src="${dependency.path}" ></script>`;
      } else {
        const absoluteToDependency = path.join(process.cwd(), dependency.path);
        const dotDots = path.relative(absoluteToDependency, process.cwd());
        const adjustedPath = path.join(dotDots, dependency.path);
        tagString += `src="${adjustedPath}"></script>`;
      }
      return tagString;
    })
    .join('\n')
};

module.exports = renderDependencies;
