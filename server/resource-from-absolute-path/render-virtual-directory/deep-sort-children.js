const alphabetically = (x, y) => {
  const xName = x.name.toLowerCase()
  const yName = y.name.toLowerCase()
  if (xName < yName) {
    return -1
  }
  if (xName > yName) {
    return 1
  }
  return 0
}
const byDirOrFile = (x, y) => {
  const xIsDir = x.type === 'directory'
  const yIsDir = y.type === 'directory'
  if (xIsDir && yIsDir) {
    return 0
  }
  if (xIsDir && !yIsDir) {
    return -1
  }
  return 1
}
const deepSortChildren = (dirElement) => {
  if (Array.isArray(dirElement.children)) {
    for (const child of dirElement.children) {
      deepSortChildren(child)
    }
    dirElement.children.sort(alphabetically)
    dirElement.children.sort(byDirOrFile)
  }
}

module.exports = deepSortChildren
