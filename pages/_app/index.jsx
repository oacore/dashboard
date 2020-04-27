import React from 'react'
import NextApp from 'next/app'
import { withRouter } from 'next/router'

import '@oacore/design/lib/index.css'

import Route from './route'
import './index.css'

import { UnauthorizedError } from 'api/errors'
import { logPageView } from 'utils/analytics'
import { initStore, GlobalProvider } from 'store'
import Application from 'components/application'
import { Sentry } from 'utils/sentry'

process.on('unhandledRejection', (err) => {
  Sentry.captureException(err)
})

process.on('uncaughtException', (err) => {
  Sentry.captureException(err)
})

const ROUTES_WITHOUT_STORE = ['/login']

class App extends NextApp {
  state = {
    isAuthorized: false,
  }

  store = initStore()

  handleRouteChange = (url) => {
    logPageView(url)
    const { dataProvider, activity } = new Route(url)

    if (!Number.isNaN(Number(dataProvider))) {
      this.store.switchDataProvider(dataProvider)
      this.store.changeActivity(activity || 'overview')
    }
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    // Provide the store to getInitialProps of pages
    if (Component.getInitialProps)
      pageProps = (await Component.getInitialProps({ ...ctx })) || {}

    // add the header only on server-side
    if (ctx?.res != null) {
      ctx.res.setHeader(
        'Content-Security-Policy',
        [
          // consider everything from these two domains as a safe
          "default-src 'self' *.core.ac.uk core.ac.uk",
          // in development there are attached inline scripts
          // (probably from hot reload or some Next.JS magic)
          `script-src 'self' *.google-analytics.com ${
            process.env.NODE_ENV !== 'production' ? "'unsafe-inline'" : ''
          }`,
          `style-src 'self' ${
            process.env.NODE_ENV !== 'production' ? "'unsafe-inline'" : ''
          }`,
          // google analytics may transport info via image
          // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#transport
          "img-src 'self' *.core.ac.uk core.ac.uk data: 'self' *.google-analytics.com",
          `connect-src 'self' *.core.ac.uk core.ac.uk sentry.io *.google-analytics.com ${
            process.env.NODE_ENV !== 'production'
              ? 'localhost:* 127.0.0.1:*'
              : ''
          }`,
        ].join(';')
      )
    }

    return {
      pageProps,
    }
  }

  redirectToLogin = () => {
    const { router } = this.props
    router.push('/login')
  }

  handlePromiseRejection = (event) => {
    if (event.reason instanceof UnauthorizedError) {
      this.redirectToLogin(window.location.href)
      // Don't report to console
      event.preventDefault()
    }
  }

  fetchUser = async () => {
    try {
      const { dataProvider, activity } = new Route(window.location.pathname)
      await this.store.init(dataProvider, activity)
      this.setState({ isAuthorized: true })
      Sentry.configureScope((scope) => {
        scope.setUser({
          id: this.store.user.id,
          email: this.store.user.email,
        })
      })
    } catch (unauthorizedError) {
      // TODO: Do some check before redirect
      this.setState({ isAuthorized: false })
      if (!this.isRouteWithoutStore) this.redirectToLogin()
      throw unauthorizedError
    }
  }

  get isRouteWithoutStore() {
    const { router } = this.props
    return ROUTES_WITHOUT_STORE.find((r) => router.asPath.startsWith(r))
  }

  async componentDidMount() {
    const { router } = this.props

    // we use routeChangeStart to immediately update selected activity
    router.events.on('routeChangeStart', this.handleRouteChange)
    window.addEventListener('unhandledrejection', this.handlePromiseRejection)

    if (!this.isRouteWithoutStore) await this.fetchUser()
  }

  componentWillUnmount() {
    const { router } = this.props
    router.events.off('routeChangeComplete', this.handleRouteChange)
    window.removeEventListener(
      'unhandledrejection',
      this.handlePromiseRejection
    )
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key])
        scope.setExtra('ssr', false)
      })
      scope.setExtra('dataProvider', this.store.dataProvider)
      scope.setExtra('activity', this.store.activity)

      Sentry.captureException(error)
    })

    if (error instanceof UnauthorizedError) this.redirectToLogin()
  }

  AppShell = () => {
    const { store } = this
    const { Component, pageProps } = this.props
    const { isAuthorized } = this.state

    if (!isAuthorized) {
      return (
        <>
          <Application dataProvider={undefined} activity="overview" />
          {this.isRouteWithoutStore ? <Component {...pageProps} /> : null}
        </>
      )
    }

    return (
      <Application
        dataProvider={store.dataProvider}
        activity={store.activity.id}
        isAuthenticated
      >
        <Component {...pageProps} />
      </Application>
    )
  }

  render() {
    const { store, AppShell } = this

    return (
      <GlobalProvider store={store}>
        <AppShell />
      </GlobalProvider>
    )
  }
}

export default withRouter(App)
