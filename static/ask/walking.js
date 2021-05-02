export const sortNodes = (nodes) =>
  function (node, parent, prop, index) {
    node.parent = parent;
    if (Array.isArray(nodes[node.type])) {
      nodes[node.type].push(node);
    } else {
      nodes[node.type] = [node];
    }

    // this dot: skip, remove, replace
    // this !== node
  };
