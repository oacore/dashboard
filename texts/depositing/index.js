import overview from './overview.yml'
import Template from '../template'

const templateProps = ['complianceLevel', 'compliance-level']
templateProps.forEach(property => {
  overview.description[property] = new Template(overview.description[property])
})

export default { overview }
export { overview }
