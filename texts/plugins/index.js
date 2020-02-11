import Template from '../template'
import discoverySource from './discovery.md'
import recommenderSource from './recommender.md'

const discovery = {
  ...discoverySource.attributes,
  description: new Template(discoverySource.body),
}

const recommender = {
  ...recommenderSource.attributes,
  description: new Template(recommenderSource.body),
}

export default { discovery, recommender }
export { discovery, recommender }
