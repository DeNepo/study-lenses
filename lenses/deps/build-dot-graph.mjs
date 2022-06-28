import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import dependencyCruiser from 'dependency-cruiser';
const { cruise } = dependencyCruiser;

// ---------- make and find things

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const cruiserOptions = JSON.parse(
  await readFile(path.join(__dirname, '.dependency-cruiser.json'), 'utf-8'),
);

// ---------- export

export const buildDotGraph = async (resourcePath = '') => {
  // just in case
  const originalCwd = process.cwd();

  // cd to the resource for a more zoomed graph
  let changedCwd = false;
  if (path.resolve(process.cwd()) !== path.resolve(resourcePath)) {
    changedCwd = true;
    process.chdir(resourcePath);
  }

  // build the graph
  const graph = cruise([resourcePath], cruiserOptions).output;

  // cd back to the studied directory
  if (changedCwd) {
    process.chdir(originalCwd);
  }

  return graph;
};
