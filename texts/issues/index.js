import sourceMessages from './messages.yml'
import issuesTab from './issues.yml'

const messages = {}
Object.values(sourceMessages).forEach((msg) => {
  messages[msg.type] = msg
})

export default {
  ...issuesTab,
  messages,
}
