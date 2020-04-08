import Template from '../template'
import overview from './overview.yml'
import coverageSource from './coverage.md'
import exporting from './export.yml'
import table from './table.yml'

const coverage = {
  ...coverageSource.attributes,
  body: new Template(coverageSource.body),
}

overview.description = new Template(overview.description)
exporting.description = new Template(exporting.description)

export default { overview, coverage, exporting, table }
export { overview, coverage, exporting, table }
