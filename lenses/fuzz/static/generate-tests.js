import chance from "./chance.js";

export const generateTests = (args, solution, length = 10) => {
  const tests = [];
  for (let i = 0; i < length; i++) {
    const generatedArgs = args(chance);
    if (!Array.isArray(generatedArgs)) {
      throw new Error("generated arguments must be wrapped in an array");
    }
    let throws = false;
    let expect;
    try {
      expect = solution(...generatedArgs);
    } catch (thrown) {
      throws = true;
      expect = thrown;
    }
    tests.push({
      args: generatedArgs,
      expect,
      throws,
    });
  }
  return tests;
};
