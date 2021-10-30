const blanksGeneratorOperators = (blank, tokens = []) => ({
  // + AssignmentExpression: ƒ AssignmentExpression(node, state)
  AssignmentExpression(node, state) {
    tokens.add("_ = _");
    this[node.left.type](node.left, state);
    state.write(" " + blank + " ");
    this[node.right.type](node.right, state);
  },
  AssignmentPattern(node, state) {
    tokens.add("_ = _");
    this[node.left.type](node.left, state);
    state.write(" " + blank + " ");
    this[node.right.type](node.right, state);
  },
  BinaryExpression(node, state) {
    tokens.add("_ " + node.operator + " _");
    this[node.left.type](node.left, state);
    state.write(" " + blank + " ");
    this[node.right.type](node.right, state);
  },
  ConditionalExpression(node, state) {
    tokens.add("_ ? _ : _");
    this[node.test.type](node.test, state);
    state.write(" " + blank + " ");
    this[node.consequent.type](node.consequent, state);
    state.write(" " + blank + " ");
    this[node.alternate.type](node.alternate, state);
  },
  LogicalExpression(node, state) {
    tokens.add("_ " + node.operator + " _");
    this[node.left.type](node.left, state);
    state.write(" " + blank + " ");
    this[node.right.type](node.right, state);
  },
  UnaryExpression(node, state) {
    if (node.prefix) {
      tokens.add(node.operator + "_");
      state.write(blank);
      this[node.argument.type](node.argument, state);
    } else {
      tokens.add("_" + node.operator);
      this[node.argument.type](node.argument, state);
      state.write(blank);
    }
  },
  UpdateExpression(node, state) {
    if (node.prefix) {
      tokens.add(node.operator + "_");
      state.write(blank);
      this[node.argument.type](node.argument, state);
    } else {
      tokens.add("_" + node.operator);
      this[node.argument.type](node.argument, state);
      state.write(blank);
    }
  },
  VariableDeclarator(node, state) {
    tokens.add("_ = _");
    this[node.id.type](node.id, state);
    if (node.init) {
      state.write(" " + blank + " ");
      this[node.init.type](node.init, state);
    }
  },
  RestElement(node, state) {
    tokens.add("..._");
    state.write(blank);
    this[node.argument.type](node.argument, state);
  },
  SpreadElement(node, state) {
    tokens.add("..._");
    state.write(blank);
    this[node.argument.type](node.argument, state);
  },
});

// treat these as syntax structures and leave them be
//  for now
// - SequenceExpression: ƒ SequenceExpression(node, state)
// - TemplateLiteral: ƒ TemplateLiteral(node, state)
// - TemplateElement: ƒ TemplateElement(node, state)

// not
// - ArrayExpression: ƒ ArrayExpression( node, state )
// - ArrayPattern: ƒ ArrayExpression( node, state )
// - ArrowFunctionExpression: ƒ ArrowFunctionExpression( node, state )
// - BlockStatement: ƒ BlockStatement( node, state )
// - CallExpression: ƒ CallExpression(node, state)
// - ClassBody: ƒ BlockStatement( node, state )
// - EmptyStatement: ƒ EmptyStatement(node, state)
// - ExpressionStatement: ƒ ExpressionStatement(node, state)
// - Identifier: ƒ Identifier(node, state)
// - LabeledStatement: ƒ LabeledStatement(node, state)
// - Literal: ƒ Literal(node, state)
// - MemberExpression: ƒ MemberExpression(node, state)
// - MetaProperty: ƒ MetaProperty(node, state)
// - MethodDefinition: ƒ MethodDefinition(node, state)
// - ObjectExpression: ƒ ObjectExpression(node, state)
// - ObjectPattern: ƒ ObjectPattern(node, state)
// - Program: ƒ Program(node, state)
// - Property: ƒ Property(node, state)
// - RegExpLiteral: ƒ RegExpLiteral(node, state)
// - TaggedTemplateExpression: ƒ TaggedTemplateExpression( node, state )
