import sourceMessages from './messages.yml'
import issuesTab from './issues.yml'

const messages = {}

// Object.values() because YAML loader for some reason
// returns objects instead arrays
Object.values(sourceMessages).forEach((msg) => {
  messages[msg.type] = msg
  Object.values(msg.matches ?? {}).forEach((type) => {
    messages[type] = msg
  })
})

const articleTemplate = Object.keys(issuesTab.article).reduce(
  (a, key) =>
    Object.assign(a, { [key]: Object.values(issuesTab.article[key]) }),
  {}
)

export default {
  ...issuesTab,
  actions: Object.values(issuesTab.actions),
  article: articleTemplate,
  messages,
}
