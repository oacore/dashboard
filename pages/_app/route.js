import Route from 'components/application/route'

/**
 * NextRoute is a Route specific for the Next.js. It defines `href` and `as`
 * properties according to the `next/router` specification.
 */
class NextRoute extends Route {
  get href() {
    const context = {
      dataProvider: this.dataProvider && '[data-provider-id]',
      activity: this.dataProvider && this.activity,
    }

    return new Route(context).toString()
  }

  get as() {
    return this.toString()
  }
}

NextRoute.parse = Route.parse

export default NextRoute
