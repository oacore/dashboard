import Template from '../template'
import { paymentRequired } from '../billing'
import overview from './overview.yml'
import sourceChart from './chart.md'
import dashboardGuide from './dashboard-guide.yml'
import crossRepositoryCheck from './cross-repository-check'
import sourceDataOverview from './data-overview.md'
import introSrc from './intro.md'
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

const intro = {
  ...introSrc.attributes,
  body: introSrc.body,
}

const dataOverview = {
  ...sourceDataOverview.attributes,
  body: new Template(sourceDataOverview.body),
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
  intro,
  dataOverview,
  chart,
  exporting,
  noData,
  publicationDates,
  paymentRequired,
  dashboardGuide,
}
export {
  overview,
  intro,
  dataOverview,
  chart,
  crossRepositoryCheck,
  exporting,
  noData,
  publicationDates,
  paymentRequired,
  dashboardGuide,
}
