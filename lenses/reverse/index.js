const reverseLense = ({ resource }) => {

  if (typeof resource.content === 'string') {
    resource.content = resource.content.split('').reverse().join('')
  }

  return {
    resource
  }
}

module.exports = reverseLense
