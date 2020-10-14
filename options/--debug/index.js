const path = require('path')

const debugOption = () => {

  console.log('--debug:  evaluating debug option')

  const beforeAll = ({ lenses }) => {
    const lensesString = lenses
      .map(lense => `"${lense.queryKey}"`)
      .join(', ')

    console.log('--debug:  before lenses ', lensesString)
  }
  const afterAll = ({ lenses }) => {
    const lensesString = lenses
      .map(lense => `"${lense.queryKey}"`)
      .join(', ')
    console.log('--debug:  after lenses ', lensesString)
  }
  const beforeEach = ({ lense }) => {
    console.log(`--debug:  before lense "${lense.queryKey}"`)
  }
  const afterEach = ({ lense }) => {
    console.log(`--debug:  after lense "${lense.queryKey}"`)
  }
  const onError = ({ error, lense, resource, responseData, config }) => {
    console.log(`--debug:  error in lense "${lense.queryKey}"`)
    console.error(error)

    resource.content = error.stack.split(path.join(__dirname, '..', '..')).join(' ... ')
    resource.info.ext = 'txt'

    responseData.status = 500

    return {
      responseData,
      resource
    }

  }

  return {
    hooks: {
      beforeAll,
      afterAll,
      beforeEach,
      afterEach,
      onError
    }
  }
}

module.exports = debugOption
