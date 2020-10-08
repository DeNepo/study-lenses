const path = require('path');
const marked = require('marked');
const renderPath = require('local-modules').renderPath;

const helloWorldLense = async (req, res, config) => {
  const { absPath, relPath, param, static } = config;

  if (path.extname(absPath) !== '.md') {
    res.writeHead(500, { 'Content-Type': 'text/plain;charset=UTF-8' });
    res.write('path must be a markdown file to view with marked', 'utf-8');
    return { req, res }
  }

  const renderedPath = await renderPath(config);

  const renderedMarkdown = marked(renderedPath.content);
  const htmlFile = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>404</title></head><body>${renderedMarkdown}</body></html>`
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(htmlFile, 'utf-8');

  return {
    req,
    res
  }
};

module.exports = helloWorldLense;
