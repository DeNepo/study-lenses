const blanksGeneratorKeywords = (blank, tokens = []) => {
  let switchDepth = 0;
  return {
    AwaitExpression(node, state) {
      tokens.add("await");
      state.write(blank + " ");
      const argument = node.argument;
      if (argument != null) {
        this[argument.type](argument, state);
      }
    },
    BreakStatement(node, state) {
      tokens.add("break");
      state.write(blank + " ");
      if (node.label) {
        this.Identifier(node.label, state);
      }
    },
    ClassDeclaration(node, state) {
      tokens.add("class");
      state.write(blank + " ");
      if (node.id) {
        this.Identifier(node.id, state);
      }
      state.write(" ");
      if (node.superClass) {
        tokens.add("extends");
        state.write(blank + " ");
        this[node.superClass.type](node.superClass, state);
        state.write(" ");
      }
      if (node.body) {
        this.ClassBody(node.body, state);
      }
    },
    ClassExpression(node, state) {
      tokens.add("class");
      state.write(blank + " ");
      if (node.id) {
        this.Identifier(node.id, state);
        state.write(" ");
      }
      if (node.superClass) {
        tokens.add("extends");
        state.write(blank + " ");
        this[node.superClass.type](node.superClass, state);
        state.write(" ");
      }
      if (node.body) {
        this.ClassBody(node.body, state);
      }
    },
    ContinueStatement(node, state) {
      tokens.add("continue");
      state.write(blank + " ");
      if (node.label) {
        this.Identifier(node.label, state);
      }
    },
    DebuggerStatement(node, state) {
      tokens.add("debugger");
      state.write(blank + " ");
    },
    DoWhileStatement(node, state) {
      tokens.add("do");
      state.write(blank + " ");
      this[node.body.type](node.body, state);
      state.write(" " + blank + " (");
      this[node.test.type](node.test, state);
      state.write("); ");
    },

    ForOfStatement(node, state) {
      tokens.add("for", "of");
      state.write(blank + " (");
      this[node.left.type](node.left, state);
      if (state.output[state.output.length - 1] === ";") {
        state.output = state.output.slice(0, state.output.length - 1);
      }
      state.write(" " + blank + " ");
      this[node.right.type](node.right, state);
      state.write(") ");
      if (node.body) {
        this[node.body.type](node.body, state);
      }
    },
    ForStatement(node, state) {
      tokens.add("for");
      state.write(blank + " (");
      if (node.init) {
        this[node.init.type](node.init, state);
        state.write(" ");
      } else {
        state.write(" ;");
      }
      if (node.test) {
        this[node.test.type](node.test, state);
        state.write(" ");
      } else {
        state.write(" ;");
      }
      if (node.update) {
        this[node.update.type](node.update, state);
      } else {
        state.write(" ;");
      }
      state.write(") ");
      if (node.body) {
        this[node.body.type](node.body, state);
      }
    },
    FunctionDeclaration(node, state) {
      tokens.add(node.generator ? "function*" : "function");
      state.write(blank + " ");
      if (node.id) {
        this.Identifier(node.id, state);
      }
      state.write(" (");
      for (const param of node.params) {
        this[param.type](param, state);
      }
      state.write(") ");
      if (node.body) {
        this.ClassBody(node.body, state);
      }
    },
    FunctionExpression(node, state) {
      tokens.add(node.generator ? "function*" : "function");
      state.write(blank + " ");
      if (node.id) {
        this.Identifier(node.id, state);
        state.write(" ");
      }
      state.write("(");
      for (const param of node.params) {
        this[param.type](param, state);
      }
      state.write(") ");
      if (node.body) {
        this.ClassBody(node.body, state);
      }
    },
    IfStatement(node, state) {
      tokens.add("if");
      state.write(blank + " (");
      this[node.test.type](node.test, state);
      state.write(") ");
      if (node.consequent) {
        this[node.consequent.type](node.consequent, state);
      }
      if (node.alternate) {
        tokens.add("else");
        state.write(" " + blank + " ");
        this[node.alternate.type](node.alternate, state);
      }
    },
    NewExpression(node, state) {
      tokens.add("new");
      state.write(blank + " ");
      this[node.callee.type](node.callee, state);
      state.write("(");
      for (const argument of node.arguments) {
        this[argument.type](argument, state);
      }
      state.write(")");
    },
    ReturnStatement(node, state) {
      tokens.add("return");
      state.write(blank + " ");
      const argument = node.argument;
      if (argument != null) {
        this[argument.type](argument, state);
      }
    },
    Super(node, state) {
      tokens.add("super");
      state.write(blank + " ");
    },
    SwitchCase(node, state) {
      const indent = Array(switchDepth).fill("  ");
      tokens.add(node.test ? "case" : "default");
      if (node.test) {
        state.write(indent + blank + " ");
        this[node.test.type](node.test, state);
      } else {
        state.write(indent + blank);
      }
      state.write(":");
      for (const consequent of node.consequent) {
        state.write("\n");
        this[consequent.type](consequent, state);
      }
    },
    SwitchStatement(node, state) {
      tokens.add("switch");
      state.write(blank + " (");
      this[node.discriminant.type](node.discriminant, state);
      state.write(") {");
      switchDepth++;
      for (const switchCase of node.cases) {
        state.write("\n");
        this[switchCase.type](switchCase, state);
      }
      switchDepth--;
      state.write("\n}");
    },
    ThisExpression(node, state) {
      tokens.add("this");
      state.write(blank);
    },
    ThrowStatement(node, state) {
      tokens.add("throw");
      state.write(blank + " ");
      const argument = node.argument;
      if (argument != null) {
        this[argument.type](argument, state);
      }
    },
    TryStatement(node, state) {
      tokens.add("try");
      state.write(blank + " ");
      this[node.block.type](node.block, state);
      if (node.handler) {
        this[node.handler.type](node.handler, state);
      }
      if (node.finalizer) {
        tokens.add("finally");
        state.write(" " + blank + " ");
        this[node.finalizer.type](node.finalizer, state);
      }
    },
    CatchClause(node, state) {
      tokens.add("catch");
      state.write(" " + blank + " (");
      this[node.param.type](node.param, state);
      state.write(") ");
      this[node.body.type](node.body, state);
    },
    VariableDeclaration(node, state) {
      tokens.add(node.kind);
      state.write(blank + " ");
      for (const declaration of node.declarations) {
        this[declaration.type](declaration, state);
      }
    },
    WhileStatement(node, state) {
      tokens.add("while");
      state.write(blank + "  (");
      this[node.test.type](node.test, state);
      state.write(") ");
      if (node.body) {
        this[node.body.type](node.body, state);
      }
    },
    WithStatement(node, state) {
      tokens.add("with");
      state.write(blank + "  (");
      this[node.object.type](node.object, state);
      state.write(") ");
      if (node.body) {
        this[node.body.type](node.body, state);
      }
    },
    YieldExpression(node, state) {
      tokens.add("yield");
      state.write(blank + " ");
      const argument = node.argument;
      if (argument != null) {
        this[argument.type](argument, state);
      }
    },
  };
};

// should have but ?blanks doesn't yet support modules
// + ExportAllDeclaration: ƒ ExportAllDeclaration(node, state)
// + ExportDefaultDeclaration: ƒ ExportDefaultDeclaration( node, state )
// + ExportNamedDeclaration: ƒ ExportNamedDeclaration(node, state)
// + ImportDeclaration: ƒ ImportDeclaration(node, state)

// - ArrayExpression: ƒ ArrayExpression( node, state )
// - ArrayPattern: ƒ ArrayExpression( node, state )
// - ArrowFunctionExpression: ƒ ArrowFunctionExpression( node, state )
// - AssignmentExpression: ƒ AssignmentExpression(node, state)
// - AssignmentPattern: ƒ AssignmentPattern(node, state)
// - BinaryExpression: ƒ BinaryExpression( node, state )
// - BlockStatement: ƒ BlockStatement( node, state )
// - CallExpression: ƒ CallExpression(node, state)
// - ClassBody: ƒ BlockStatement( node, state )
// - ConditionalExpression: ƒ ConditionalExpression(node, state)
// - EmptyStatement: ƒ EmptyStatement(node, state)
// - ExpressionStatement: ƒ ExpressionStatement(node, state)
// - Identifier: ƒ Identifier(node, state)
// - LabeledStatement: ƒ LabeledStatement(node, state)
// - Literal: ƒ Literal(node, state)
// - LogicalExpression: ƒ BinaryExpression( node, state )
// - MemberExpression: ƒ MemberExpression(node, state)
// - MetaProperty: ƒ MetaProperty(node, state)
// - MethodDefinition: ƒ MethodDefinition(node, state)
// - ObjectExpression: ƒ ObjectExpression(node, state)
// - ObjectPattern: ƒ ObjectPattern(node, state)
// - Program: ƒ Program(node, state)
// - Property: ƒ Property(node, state)
// - RegExpLiteral: ƒ RegExpLiteral(node, state)
// - RestElement: ƒ RestElement(node, state)
// - SequenceExpression: ƒ SequenceExpression(node, state)
// - SpreadElement: ƒ RestElement(node, state)
// - TaggedTemplateExpression: ƒ TaggedTemplateExpression( node, state )
// - TemplateElement: ƒ TemplateElement(node, state)
// - TemplateLiteral: ƒ TemplateLiteral(node, state)
// - UnaryExpression: ƒ UnaryExpression(node, state)
// - UpdateExpression: ƒ UpdateExpression(node, state)
// - VariableDeclarator: ƒ VariableDeclarator(node, state)
