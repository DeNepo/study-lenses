const blankenate = (
  code,
  probability = 0.2,
  config = {
    keywords: true,
    identifiers: true,
    literals: false,
    operators: false,
  }
) => {
  const blank = "__";

  let tree = null;
  try {
    tree = Acorn.parse(code);
  } catch (err) {
    document.getElementById(
      "editor-container"
    ).innerHTML = `<code style='color:red;'>${err.toString()}</code> (see console for more details)<br><pre>${code}</pre>`;
    eval(code);
    return null;
  }

  const blankedTokens = [];

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
      if (
        config.identifiers &&
        node.type === "Identifier" &&
        Math.random() < probability
      ) {
        blankedTokens.push(node.name);
        node.name = blank;
      }

      if (
        config.primitives &&
        (node.type === "Literal" || node.type === "RegExpLiteral") &&
        Math.random() < probability
      ) {
        blankedTokens.push(node.raw);
        node.raw = blank;
      }
    },
  });

  const distractors = getDistractors(code);
  const randomDistractors = Array.from(new Set(distractors))
    .filter(() => Math.random() < probability)
    .map((name) => ({ name, count: Math.round(Math.random() * 2) + 1 }));

  const tokens = Array.from(new Set(blankedTokens)).map((token) => ({
    name: token,
    count: blankedTokens.filter((i) => i === token).length,
  }));

  tokens.push(...randomDistractors);

  tokens.add = (...toAdd) =>
    toAdd.forEach((newToken) => {
      const tokenEntry = tokens.find((token) => token.name === newToken);
      if (tokenEntry) {
        tokenEntry.count++;
      } else {
        tokens.push({ name: newToken, count: 1 });
      }
    });

  let generated = "";
  let blanked = "";
  if (config.keywords || config.operators) {
    const blankifyGenerators = Object.assign({}, Astring.baseGenerator);

    blankifyGenerators.ForInStatement = function (node, state) {
      if (config.operators || config.keywords) {
        if (config.operators && !config.keywords) {
          tokens.add("in");
          state.write("for (");
        } else if (config.keywords && !config.operators) {
          tokens.add("for");
          state.write(blank + " (");
        } else if (config.keywords && config.operators) {
          tokens.add("for", "in");
          state.write(blank + " (");
        }

        this[node.left.type](node.left, state);
        if (state.output[state.output.length - 1] === ";") {
          state.output = state.output.slice(0, state.output.length - 1);
        }

        if (config.operators && !config.keywords) {
          state.write(" " + blank + " ");
        } else if (config.keywords && !config.operators) {
          state.write(" in ");
        } else if (config.keywords && config.operators) {
          state.write(" " + blank + " ");
        }

        this[node.right.type](node.right, state);
        state.write(") ");
        if (node.body) {
          this[node.body.type](node.body, state);
        }
      } else {
        this[node.type](node, state);
      }
    };

    if (config.operators) {
      Object.assign(
        blankifyGenerators,
        blanksGeneratorOperators(blank, tokens)
      );
    }
    if (config.keywords) {
      Object.assign(blankifyGenerators, blanksGeneratorKeywords(blank, tokens));
    }

    const chancifiedBlankify = {};
    for (const key in Astring.baseGenerator) {
      chancifiedBlankify[key] = function (node, state) {
        if (Math.random() < probability) {
          blankifyGenerators[key].call(this, node, state);
        } else if (key in Astring.baseGenerator) {
          Astring.baseGenerator[key](node, state);
        }
      };
    }

    const customGenerator = Object.assign(
      {},
      Astring.baseGenerator,
      chancifiedBlankify
    );

    blanked = Astring.generate(tree, {
      generator: customGenerator,
    });

    probability = 0;
    generated = Astring.generate(Acorn.parse(code));
    // generated = code;
  } else {
    blanked = prettier.format(Astring.generate(tree), {
      parser: "babel",
      plugins: prettierPlugins,
    });
    generated = prettier.format(Astring.generate(Acorn.parse(code)), {
      parser: "babel",
      plugins: prettierPlugins,
    });
  }

  tokens.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }

    return 0;
  });

  return {
    blanked,
    generated,
    tokens,
    distractors: randomDistractors,
  };
};
