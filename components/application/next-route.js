import Route from './route'

/**
 * NextRoute is a Route specific for the Next.js. It defines `href` and `as`
 * properties according to the `next/router` specification.
 */
class NextRoute extends Route {
  get href() {
    const args = [
      this.dataProvider && '[data-provider-id]',
      this.activity,
    ].filter(notEmpty => notEmpty)

    return new Route(...args).toString()
  }

  get as() {
    return this.toString()
  }
}

export default NextRoute
