import React from 'react'
import NextApp from 'next/app'
import 'mobx-react-lite/batchingForReactDom'
import { withRouter } from 'next/router'
import '@oacore/design/lib/index.css'
import './global.css'

import { UnauthorizedError } from 'api/errors'
import { AuthorizationError } from 'store/errors'
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

const ROUTES_WITHOUT_STORE = ['/login', '/reset', '/invitation']

const isRouteWithoutStore = (pathname) =>
  ROUTES_WITHOUT_STORE.find((prefix) => pathname.startsWith(prefix))

export async function getStaticProps({ res }) {
  res.setHeader(
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
        process.env.NODE_ENV !== 'production' ? 'localhost:* 127.0.0.1:*' : ''
      }`,
    ].join(';')
  )
}

class App extends NextApp {
  state = {
    isAuthorized: false,
  }

  store = initStore()

  handleRouteChange = (url, caller = 'handleRouteChange') => {
    const { store } = this
    const { router } = this.props
    const dataProviderId = router.query['data-provider-id']
    store.changeDataProvider(dataProviderId, caller)
  }

  redirectToLogin() {
    const { router } = this.props
    router.push('/login')
  }

  handlePromiseRejection = (event) => {
    if (
      event.reason instanceof AuthorizationError ||
      event.reason instanceof UnauthorizedError
    ) {
      this.setState({ isAuthorized: false })
      this.redirectToLogin(window.location.href)
      // Don't report to console
      event.preventDefault()
    }
  }

  componentDidMount() {
    window.addEventListener('unhandledrejection', this.handlePromiseRejection)

    const { router } = this.props
    router.events.on('routeChangeComplete', logPageView)

    if (isRouteWithoutStore(router.asPath)) return

    const { pathname } = window.location
    const [, dataProviderId] =
      pathname.match(/\/data-providers\/([^/]+)\/?/) ?? []
    const { store } = this
    store
      .init(dataProviderId)
      .then(() => {
        Sentry.configureScope((scope) => {
          scope.setUser({
            id: store.user.id,
            email: store.user.email,
          })
        })

        // Subscribe store to router after initialization
        router.events.on('routeChangeStart', this.handleRouteChange)

        // Trigger App render
        this.setState({ isAuthorized: true })
      })
      .catch((error) => {
        if (error instanceof AuthorizationError) {
          this.setState({ isAuthorized: false })
          this.redirectToLogin()
        } else throw error
      })
  }

  componentWillUnmount() {
    const { router } = this.props
    router.events.off('routeChangeStart', this.handleRouteChange)
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

    if (
      error instanceof AuthorizationError ||
      error instanceof UnauthorizedError
    ) {
      this.setState({ isAuthorized: false })
      this.redirectToLogin()
    }
  }

  AppShell = () => {
    const { store } = this
    const { Component, pageProps, router } = this.props
    const { isAuthorized } = this.state
    const pathname = this.props.router.asPath

    if (!isAuthorized) {
      return (
        <>
          <Application dataProvider={undefined} pathname={pathname} />
          {isRouteWithoutStore(router.asPath) ? (
            <Component {...pageProps} />
          ) : null}
        </>
      )
    }

    return (
      <Application
        dataProvider={store.dataProvider}
        pathname={pathname}
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
