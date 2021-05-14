const blankenate = (code, probability = 0.2) => {
  let tree = null;
  try {
    tree = Acorn.parse(code);
  } catch (err) {
    return err.toString();
  }

  const blankedTokens = [];

  const declaredVariables = new Set();

  const _ = (oldNode) => {
    const _node = Acorn.parse("let _; _;").body[1];
    delete _node.loc;
    _node.start = oldNode.start;
    _node.end = oldNode.end;
    _node.expression.loc = oldNode.loc;
    return _node;
  };

  walk(tree, {
    enter(node, parent, prop, index) {
      if (node.type === "Identifier" && Math.random() < probability) {
        if (parent.type === "VariableDeclarator") {
          if (!declaredVariables.has(node.name)) {
            declaredVariables.add(node.name);
          } else {
            return;
          }
        }
        blankedTokens.push(node.name);
        node.name = "_";
      } else if (
        node.type === "Literal" &&
        (typeof node.value === "boolean" ||
          node.value === null ||
          typeof node.value === "number") &&
        Math.random() < probability
      ) {
        blankedTokens.push(node.raw);
        node.raw = "_";
      } else if (
        (node.type === "BreakStatement" || node.type === "ContinueStatement") &&
        Math.random() < probability
      ) {
        const new_ = _(node.start, node.end);
        this.replace(new_);
        blankedTokens.push(
          node.type === "BreakStatement" ? "break" : "continue"
        );
      }
    },
  });

  const tokens = Array.from(new Set(blankedTokens)).map((token) => ({
    name: token,
    count: blankedTokens.filter((i) => i === token).length,
  }));

  return {
    blanked: Astring.generate(tree),
    generated: Astring.generate(Acorn.parse(code)),
    tokens,
  };
};
