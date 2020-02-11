/**
 * Route is developed to simplify constructing routes within the application.
 * It uses class instead of a function to be extendible.
 *
 * Route should be considered being a string.
 */
class Route {
  constructor(context) {
    const params = typeof context == 'string' ? Route.parse(context) : context

    const { dataProvider, activity } = params
    this.dataProvider = dataProvider
    this.activity = activity
  }

  toString() {
    const partials = [
      // only when data provider is set
      this.dataProvider && `data-providers/${this.dataProvider}`,
      // it's not possible to have activity without data provider
      this.dataProvider && this.activity,
    ].filter(notEmpty => notEmpty)

    return `/${partials.join('/')}` // with leading slash
  }
}

Route.parse = routeString => {
  // Skip leading slash if exists
  const s = routeString.charAt() === '/' ? routeString.slice(1) : routeString

  // Skip '/data-providers/' part
  const [, dataProvider, ...activityPartials] = s.split('/')
  const activity = activityPartials.join('/')

  return { dataProvider, activity }
}

export default Route
