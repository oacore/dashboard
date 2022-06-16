import overview from './overview.yml'

export default {
  ...overview,
  actions: Object.values(overview.actions),
}
export { overview }
