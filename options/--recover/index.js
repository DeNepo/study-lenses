const recoverOption = () => {
  const onError = ({ error, lens }) => {
    console.log(`-continue:  error in lens "${lens.queryKey}"`);
    console.error(error);

    return {
      recover: true,
    };
  };

  return {
    hooks: {
      onError,
    },
  };
};

module.exports = recoverOption;
