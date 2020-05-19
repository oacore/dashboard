import Template from '../template'
import overview from './overview.yml'
import sourceChart from './chart.md'
import crossRepositoryCheck from './cross-repository-check'
import sourceDataOverview from './data-overview.md'
import complianceNotice from './compliance-notice.md'
import noDataNotice from './no-data.md'
import exporting from './export.yml'
import publicationDates from './publication-dates.yml'

const templateProps = [
  'complianceLevel',
  'missingData',
  'allCompliant',
  'allNonCompliant',
]
templateProps.forEach((property) => {
  overview.description[property] = new Template(overview.description[property])
})

exporting.description = new Template(exporting.description)

const dataOverview = {
  ...sourceDataOverview.attributes,
  body: new Template(sourceDataOverview.body),
}

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
  dataOverview,
  chart,
  compliance,
  exporting,
  noData,
  publicationDates,
}
export {
  overview,
  dataOverview,
  chart,
  compliance,
  crossRepositoryCheck,
  exporting,
  noData,
  publicationDates,
}
