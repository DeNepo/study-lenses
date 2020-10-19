const tableOfContents = (virDir, path = virDir.path, indent = '') => {

  const dirList = virDir.dirs
    ? virDir.dirs
      .map(subDir => {
        const subPath = pathModule.normalize(pathModule.join(path, subDir.path)).split('//').join('/');
        const subIndex = tableOfContents(subDir, subPath, indent + '  ');
        return `${indent}<li><details><summary><a href=".${subPath}">${subDir.path}</a></summary>\n`
          + (subIndex ? '\n<ul>' + subIndex + '</ul>' : '')
          + '</details></li>';
      })
      .reduce((list, li) => list + li, '')
    : '';

  const filesList = virDir.files
    ? `${virDir.files
      .map(file => {
        const filePath = path + file.path;
        const isHtml = pathModule.extname(filePath) === '.html';
        return isHtml
          ? `${indent}<li><a href=".${filePath}?live-study">${file.path}</a>  <a href=".${filePath}" target="_blank">(new tab)</a></li>\n`
          : `${indent}<li><a href=".${filePath}?live-study">${file.path}</a></li>\n`;
      })
      .reduce((list, li) => list + li, '')}`
    : '';
  return dirList + filesList + '\n';
};
