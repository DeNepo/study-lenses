import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// import { exec } from 'child_process';

import dependencyCruiser from 'dependency-cruiser';
const { cruise } = dependencyCruiser;

import graphvizCLI from 'graphviz-cli';
const { renderGraphFromSource } = graphvizCLI;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const cruiserOptions = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '.', '.dependency-cruiser.json'),
    'utf-8',
  ),
);

export default async ({ resource }) => {
  let resourcePath = resource.path;
  if (resource.info.type !== 'directory') {
    resourcePath = path.join(resource.path, '..');
  }

  const graph = cruise([resourcePath], cruiserOptions).output;

  const rendered = await renderGraphFromSource(
    { input: graph },
    { format: 'svg' },
  );

  resource.content = rendered;
  resource.info.ext = '.svg';

  return { resource };
};
