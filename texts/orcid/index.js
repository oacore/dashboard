import orcid from './orcid.yml'
import sourceMessages from '../issues/messages.yml'

const messages = {}

Object.values(sourceMessages).forEach((msg) => {
  messages[msg.type] = msg
  Object.values(msg.matches ?? {}).forEach((type) => {
    messages[type] = msg
  })
})

const articleTemplate = Object.keys(orcid.article).reduce(
  (a, key) => Object.assign(a, { [key]: Object.values(orcid.article[key]) }),
  {}
)

export default {
  ...orcid,
  actions: Object.values(orcid.actions),
  article: articleTemplate,
  messages,
}
