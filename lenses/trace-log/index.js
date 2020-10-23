'use strict';

const Acorn = require("acorn")
const Aran = require("aran")
const Astring = require("astring")


const traceLogLens = ({ resource, config }) => {

  if (!resource.info && !resource.info.ext === '.js') {
    return
  }

  if (typeof config.queryValue.content === 'string') {
    resource.content = config.queryValue.content
  }

  let depth = "";

  let traceLog = "";

  // advice
  global.ADVICE = {
    apply: (f, t, xs, serial) => {

      traceLog += (depth + f.name + "(" + xs.join(", ") + ")\n");
      depth += " ";
      const x = Reflect.apply(f, t, xs);
      depth = depth.substring(1);
      traceLog += (depth + x + '\n');
      return x;
    }
  };


  const pointcut = (name, node) =>
    name === "apply" && node.type === "CallExpression";

  const aran = Aran({ namespace: "ADVICE" });

  global.eval(Astring.generate(aran.setup()));

  const estree1 = Acorn.parse(resource.content, { locations: true });
  // console.log(JSON.stringify(estree1, null, '  '))

  const estree2 = aran.weave(estree1, pointcut);

  global.eval(Astring.generate(estree2));

  resource.content = traceLog
  resource.info.ext = '.txt'

  return {
    resource
  }


}

module.exports = traceLogLens
