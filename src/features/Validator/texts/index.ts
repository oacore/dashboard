import validator from './validator.json'

// Define the validation message type based on the JSON structure
interface ValidationMessage {
  title: string
  key: string
  severity: string
  description: string
  resolution: string
  seeMoreLink: string
  matches?: Record<string, string>
}

// Type the validation object
const validation: Record<string, ValidationMessage> = {}

// Type assertion with proper typing
const validations = validator?.validations as ValidationMessage[]

validations.forEach((msg) => {
  validation[msg.title] = msg
  Object.values(msg.matches ?? {}).forEach((title) => {
    validation[title] = msg
  })
})

export default {
  actions: validations,
  validation,
  validator,
}
