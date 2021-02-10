const path = require("path");

const debugOption = () => {
  console.log("--debug:  evaluating debug option");

  const beforeAll = ({ lenses }) => {
    const lensesString = lenses.map((lens) => `"${lens.queryKey}"`).join(", ");

    console.log("--debug:  before all ", lensesString);
  };
  const afterAll = ({ lenses }) => {
    const lensesString = lenses.map((lens) => `"${lens.queryKey}"`).join(", ");
    console.log("--debug:  after all ", lensesString);
  };
  const beforeEach = ({ lens }) => {
    console.log(`--debug:  before lens "${lens.queryKey}"`);
    console.log("locals:", JSON.stringify(lens.locals, null, "  "));
  };
  const afterEach = ({ lens }) => {
    console.log(`--debug:  after lens "${lens.queryKey}"`);
  };
  const onError = ({ error, lens, resource, responseData, config }) => {
    console.log(`--debug:  error in lens "${lens.queryKey}"`);
    console.error(error);

    resource.content = error.stack
      .split(path.join(__dirname, "..", ".."))
      .join(" ... ");
    resource.info.ext = "txt";

    responseData.status = 500;

    return {
      responseData,
      resource,
    };
  };

  return {
    hooks: {
      beforeAll,
      afterAll,
      beforeEach,
      afterEach,
      onError,
    },
  };
};

module.exports = debugOption;
