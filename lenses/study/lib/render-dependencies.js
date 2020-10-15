const path = require('path')

path.i

const renderDependencies = (dependencies, resource) => {
  if (!Array.isArray(dependencies)) {
    return ''
  }

  return dependencies
    .map(dependency => {
      let tagString = `<script `
      if (dependency.module) {
        tagString += 'type="module" '
      }
      if (dependency.absolute) {
        tagString += `src="${dependency.path}" ></script>`
      } else {
        const dotDots = resource.info.type === 'file'
          ? resource.info.toCwd.split('/').slice(2).join('/')
          : resource.info.toCwd.split('/').slice(1).join('/')
        tagString += `src="${dotDots}/${dependency.path}"></script>`
      }
      return tagString
    })
    .join('\n')
}

module.exports = renderDependencies
