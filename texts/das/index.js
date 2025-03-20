import das from './das.yml'
import sourceMessages from '../issues/messages.yml'

const messages = {}

Object.values(sourceMessages).forEach((msg) => {
  messages[msg.type] = msg
  Object.values(msg.matches ?? {}).forEach((type) => {
    messages[type] = msg
  })
})

const articleTemplate = Object.keys(das.article).reduce(
  (a, key) => Object.assign(a, { [key]: Object.values(das.article[key]) }),
  {}
)

export default {
  ...das,
  actions: Object.values(das.actions),
  article: articleTemplate,
  messages,
}
