import overview from './overview.yml'
import chart from './chart.yml'
import complianceNotice from './compliance-notice.md'
import exporting from './export.yml'
import Template from '../template'

const templateProps = ['complianceLevel', 'compliance-level']
templateProps.forEach(property => {
  overview.description[property] = new Template(overview.description[property])
})

exporting.description = new Template(exporting.description)

const compliance = {
  ...complianceNotice.attributes,
  body: new Template(complianceNotice.body),
}

export default { overview, chart, compliance, exporting }
export { overview, chart, compliance, exporting }
