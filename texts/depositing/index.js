import overview from './overview.yml'
import sourceChart from './chart.md'
import complianceNotice from './compliance-notice.md'
import noDataNotice from './no-data.md'
import exporting from './export.yml'
import Template from '../template'
import publicationDates from './publication-dates.yml'

const templateProps = ['complianceLevel', 'compliance-level']
templateProps.forEach((property) => {
  overview.description[property] = new Template(overview.description[property])
})

exporting.description = new Template(exporting.description)

const compliance = {
  ...complianceNotice.attributes,
  body: new Template(complianceNotice.body),
}

const noData = {
  ...noDataNotice.attributes,
  body: noDataNotice.body,
}

const chart = {
  ...sourceChart.attributes,
  body: sourceChart.body,
}

export default {
  overview,
  chart,
  compliance,
  exporting,
  noData,
  publicationDates,
}
export { overview, chart, compliance, exporting, noData, publicationDates }
