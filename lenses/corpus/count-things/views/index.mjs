import { renderObject } from './render-object.mjs';

import { dirLinks } from './dir-links.mjs';

export const renderSourceAnalysis = (analysis, fileName = '', code = '') => {
  const title = fileName ? `<h1>${analysis.type}: ${fileName}</h1>` : '';

  const sourceCode = `<pre class="language-js"><code class="language-js line-numbers">${code}</code></pre>`;

  const variableNames = analysis.variables
    ? renderObject(
        `Variable Names:  ${Object.keys(analysis.variables).length}`,
        analysis.variables,
      )
    : '';

  const lineLengths = renderObject(
    `Lines: ${analysis.lines.total}`,
    analysis.lines.lengths,
  );

  const hashBang = analysis.hashBang
    ? `<h2 style="display: inline;">HashBang: <code>${analysis.hashBang}</code></h2>`
    : '';

  const comments = analysis.comments
    ? renderObject(
        `Comments: ${Object.keys(analysis.comments).length}`,
        analysis.comments,
      )
    : '';

  const directives = analysis.directives
    ? renderObject(
        `Directives: ${Object.keys(analysis.directives).length}`,
        analysis.directives,
      )
    : '';

  const literals = analysis.literals
    ? renderObject(
        `Literal Types: ${Object.keys(analysis.literals).length}`,
        analysis.literals,
      )
    : '';

  const nodeTypes = analysis.nodeTypes
    ? renderObject(
        `Node Types:  ${Object.keys(analysis.nodeTypes).length}`,
        analysis.nodeTypes,
      )
    : '';

  const identifiers = analysis.identifiers
    ? renderObject(
        `Identifiers:  ${Object.keys(analysis.identifiers).length}`,
        analysis.identifiers,
      )
    : '';

  return `
    ${title}
    ${hashBang}
    ${directives}
    ${variableNames}
    ${comments}
    ${lineLengths}
    ${nodeTypes}
    ${literals}
    ${identifiers}
    <hr />
    ${sourceCode}
  `;
};

export const renderVirDirAnalysis = (virDir = {}, analysis = {}) => {
  const links = dirLinks({
    dirElement: virDir,
    top: true,
  });

  const title = `<h1>/${analysis.name}</h1>`;

  const summary = analysis.javascriptSummary;

  const files = summary.lines
    ? renderObject(`Files: ${summary.files.total}`, summary.files)
    : '';

  const lines = summary.lines
    ? renderObject(`Lines: ${summary.lines.total}`, summary.lines)
    : '';

  const types = summary.types
    ? renderObject(`Types: ${Object.keys(summary.types).length}`, summary.types)
    : '';

  const hashBangs = summary.hashBangs
    ? renderObject(
        `HashBangs: ${Object.values(summary.hashBangs).reduce(
          (all, next) => all + next,
          0,
        )}`,
        summary.hashBangs,
      )
    : '';

  const directives = summary.directives
    ? renderObject(
        `Directives: ${Object.keys(summary.directives).length}`,
        summary.directives,
      )
    : '';

  const variableNames = summary.variables
    ? renderObject(
        `Variable Names:  ${Object.keys(summary.variables).length}`,
        summary.variables,
      )
    : '';

  const comments = summary.comments
    ? renderObject(
        `Comments: ${Object.keys(summary.comments).length}`,
        summary.comments,
      )
    : '';

  const literals = summary.literals
    ? renderObject(
        `Literal Types: ${Object.keys(summary.literals).length}`,
        summary.literals,
      )
    : '';

  const nodeTypes = summary.nodeTypes
    ? renderObject(
        `Node Types:  ${Object.keys(summary.nodeTypes).length}`,
        summary.nodeTypes,
      )
    : '';

  const identifiers = summary.identifiers
    ? renderObject(
        `Identifiers:  ${Object.keys(summary.identifiers).length}`,
        summary.identifiers,
      )
    : '';

  return `
    ${links}
    <hr />
    ${title}
    ${files}
    ${hashBangs}
    ${types}
    ${directives}
    ${variableNames}
    ${comments}
    ${nodeTypes}
    ${identifiers}
    ${lines}
    ${literals}
  `;
};
