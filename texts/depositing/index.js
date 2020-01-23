import overview from './overview.yml'
import Template from '../template'

overview.description = new Template(overview.description)

export default { overview }
export { overview }
