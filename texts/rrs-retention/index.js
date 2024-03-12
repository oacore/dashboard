import rrs from './rrs.yml'
import sourceMessages from '../issues/messages.yml'

const messages = {}

Object.values(sourceMessages).forEach((msg) => {
  messages[msg.type] = msg
  Object.values(msg.matches ?? {}).forEach((type) => {
    messages[type] = msg
  })
})

const articleTemplate = Object.keys(rrs.article).reduce(
  (a, key) => Object.assign(a, { [key]: Object.values(rrs.article[key]) }),
  {}
)

export default {
  ...rrs,
  actions: Object.values(rrs.actions),
  article: articleTemplate,
  messages,
}
