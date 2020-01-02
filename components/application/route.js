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
    return [`/data-providers/${this.dataProvider}`, this.activity]
      .filter(notEmpty => notEmpty)
      .join('/')
  }
}

Route.parse = routeString => {
  // Skip leading slash if exists
  const s = routeString.charAt() === '/' ? routeString.slice(1) : routeString

  // Skip '/data-providers/' part
  const [, dataProvider, activity] = s.split('/')

  return { dataProvider, activity }
}

export default Route
