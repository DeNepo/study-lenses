import { config as sharedConfig } from '../config.js';
const config = sharedConfig.openEnded;

export const sortNodes = (nodes) =>
  function (node, parent, prop, index) {
    node.parent = parent;

    if (
      node.loc.start.line < config.range.start ||
      node.loc.start.line > config.range.end
    ) {
      return;
    }

    if (Array.isArray(nodes[node.type])) {
      nodes[node.type].push(node);
    } else {
      nodes[node.type] = [node];
    }

    // this dot: skip, remove, replace
    // this !== node
  };
