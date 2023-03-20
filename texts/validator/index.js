import validator from './validator.yml'

const validation = {}

Object.values(validator?.validations).forEach((msg) => {
  validation[msg.title] = msg
  Object.values(msg.matches ?? {}).forEach((title) => {
    validation[title] = msg
  })
})

export default {
  actions: Object.values(validator?.validations),
  validation,
  validator,
}
