import path from 'path';

import { buildDotGraph } from './build-dot-graph.mjs';

export default async ({ resource, config }) => {
  let resourcePath = resource.path;
  if (resource.info.type !== 'directory') {
    resourcePath = path.join(resource.path, '..');
  }

  const dotGraph = await buildDotGraph(resourcePath);

  resource.info.ext = '.html';
  resource.content = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title></title>

  </head>

  <body>
    <div id="root"></div>

    <script src="${config.sharedStatic}/d3.min.js"></script>

    <script src="${config.ownStatic}/hpcc-js-wasm.js"></script>

    <script src="${config.ownStatic}/d3-graphviz.js"></script>


    <script>
      const graph = decodeURIComponent("${encodeURIComponent(dotGraph)}");
      d3.select("#root")
        .graphviz()
          .renderDot(graph);
    </script>
  </body>
</html>
`;

  return { resource };
};
