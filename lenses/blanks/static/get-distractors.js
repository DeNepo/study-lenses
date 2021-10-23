const getDistractors = (code = "") => {
  const blockComments = code.match(/[^\S\r\n]*\/\*([\S\s]*?)\*\/[^\S\r\n]*/gm);

  if (!blockComments) {
    return [];
  }

  const distractors = [];
  for (const blockComment of blockComments) {
    if (!blockComment.match(/distractors\:.*/gim)) {
      continue;
    }
    const commentBody = blockComment.replace(/distractors\:.*/gim, "");
    const tokens = commentBody
      .split(/[\s,]+/)
      .filter((token) => token !== "/*" && token !== "*/");

    distractors.push(tokens);
  }

  return Array.isArray(distractors) ? distractors.flatMap((item) => item) : [];
};
