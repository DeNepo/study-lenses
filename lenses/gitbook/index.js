const path = require('path');
const fs = require('fs');
const util = require('util');

const readFilePromise = util.promisify(fs.readFile);

const gitbookfiy = require('./gitbookify.js');

const gitbookLens = async ({ resource, lenses, config }) => {
  if (resource.info.type !== 'directory') {
    return;
  }

  // render like a gitbook if there is a Summary.md
  const summaryMdPath = path.join(resource.path, 'SUMMARY.md');
  if (fs.existsSync(summaryMdPath)) {
    const readmeMdPath = path.join(resource.path, 'readme.md');
    const readmeExists = fs.existsSync(readmeMdPath);
    const rawMarkdown = await readFilePromise(summaryMdPath, 'utf-8');
    const renderedMarkdown = gitbookfiy(rawMarkdown, readmeExists, config);

    resource.info.ext = '.html';
    resource.content = renderedMarkdown;

    return { resource };
  } else {
    return lenses.study.use({ resource });
  }
};

module.exports = gitbookLens;
