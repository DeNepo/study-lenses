let TypeClass = {};
if (config.stepsExt === '.js') {
  const { SteppedJavaScriptFE } = await import('./stepped-javascript.js');
  TypeClass = SteppedJavaScriptFE;
} else if (config.stepsExt === '.html') {
  const { SteppedHtmlFE } = await import('./stepped-html.js');
  TypeClass = SteppedHtmlFE;
} else {
  const { SteppedCodeFE } = await import('./stepped-code.js');
  TypeClass = SteppedCodeFE;
}

config.ext = config.stepsExt;

try {
  new TypeClass(config, steps);
} catch (o_0) {}
