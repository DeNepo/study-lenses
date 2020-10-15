const recoverOption = () => {

  const onError = ({ error, lense }) => {
    console.log(`--continue:  error in lense "${lense.queryKey}"`)
    console.error(error)

    return {
      recover: true
    }

  }

  return {
    hooks: {
      onError
    }
  }
}

module.exports = recoverOption
