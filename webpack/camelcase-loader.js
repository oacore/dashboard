const camelCase = require('lodash.camelcase')

const camelize = (source, { deep = true } = {}) => {
  const result = {}
  Object.entries(source).forEach(([key, value]) => {
    const newValue =
      typeof value == 'object' && deep ? camelize(value, { deep }) : value
    result[key] = newValue
    result[camelCase(key)] = newValue
  })
  return result
}

const camelcaseLoader = function loadDataFile(content) {
  const callback = this.async()
  callback(null, JSON.stringify(camelize(JSON.parse(content))))
}

module.exports = camelcaseLoader
