// main
const trace = (code) => {
  let depth = "";

  let logs = 0;

  // advice
  window.ADVICE = {
    apply: (f, t, xs, serial) => {
      const node = aran.nodes[serial];
      const line = node.loc.start.line;
      console.log(
        `${++logs}. line ${line}:  ` +
          depth +
          f.name +
          "(" +
          xs.join(", ") +
          ")\n"
      );
      depth += " ";
      const x = Reflect.apply(f, t, xs);
      depth = depth.substring(1);
      console.log(`${++logs}. line ${line}:  ` + depth + x + "\n");
      return x;
    },
  };

  const pointcut = (name, node) =>
    name === "apply" && node.type === "CallExpression";

  const aran = Aran({ namespace: "ADVICE" });

  window.eval(Astring.generate(aran.setup()));

  const estree1 = Acorn.parse(code, { locations: true });
  // console.log(estree1);

  const estree2 = aran.weave(estree1, pointcut);

  window.eval(Astring.generate(estree2));
};
