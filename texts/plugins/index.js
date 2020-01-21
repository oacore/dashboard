import discoverySource from './discovery.md'
import recommenderSource from './recommender.md'

const discovery = {
  ...discoverySource.attributes,
  description: discoverySource.body,
}

const recommender = {
  ...recommenderSource.attributes,
  description: recommenderSource.body,
}

export default { discovery, recommender }
export { discovery, recommender }
