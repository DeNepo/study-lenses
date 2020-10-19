const prettier = require('prettier');

const simplit = (path = '', src = '', noChunks = false) => {

  const lastThingInPath = path.split('/')[path.split('/').length - 1];
  const hasFileExtension = lastThingInPath.includes('.');
  const isSimplitPath = hasFileExtension && (lastThingInPath.split('.')[lastThingInPath.split('.').length - 1] === 'md' && lastThingInPath.split('.').length > 2)
  const extname = isSimplitPath
    ? lastThingInPath.split('.')[lastThingInPath.split('.').length - 2]
    : lastThingInPath.split('.')[lastThingInPath.split('.').length - 1];

  const comment = noChunks
    ? (_) => ''
    : (extname === '.js' || extname === '.ts')
      ? (num) => `// chunk ${num}\n`
      : extname === '.html'
        ? (num) => `<!-- chunk ${num} -->\n`
        : extname === '.css'
          ? (num) => `/* chunk ${num} */\n`
          : (_) => '';

  const regex = new RegExp('```' + extname.replace('.', '') + '([\\s\\S]*?)```', 'gim');


  let build = '';
  let blocks = 1;
  const keepCode = (commentTemplate) => (_, code) => {
    build += commentTemplate(blocks) +
      code +
      '\n';
    blocks++;
  };

  src.replace(regex, keepCode(comment));

  const formatted = (extname === '.js' || extname === '.ts')
    ? prettier.format(build, { parser: "babel-ts" })
    : extname === '.html'
      ? prettier.format(build, { parser: "html" })
      : extname === '.css'
        ? prettier.format(build, { parser: "css" })
        : extname === '.json'
          ? prettier.format(build, { parser: "json" })
          : build;

  return formatted;
};


module.exports = simplit;
