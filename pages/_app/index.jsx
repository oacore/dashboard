import React from 'react'
import NextApp from 'next/app'
import { withRouter } from 'next/router'

import '@oacore/design/lib/index.css'
import './global.css'
import { initStore, GlobalProvider } from 'store'
import { UnauthorizedError } from 'api/errors'
import { AuthorizationError, AccessError, NotFoundError } from 'store/errors'
import { logPageView } from 'utils/analytics'
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
  ROUTES_WITHOUT_STORE.some((prefix) => pathname.startsWith(prefix))

class App extends NextApp {
  state = {
    isAuthorized: false,
    acceptedTCVersion: 0,
  }

  store = initStore()

  handleRouteChange = (url, caller = 'handleRouteChange') => {
    const { store } = this
    const { router } = this.props
    const dataProviderId = router.query['data-provider-id']
    store.changeDataProvider(dataProviderId, caller)
  }

  redirectToLogin({ reason = 'logout' } = {}) {
    const { router } = this.props
    const basePath = '/login'
    router.push(
      `${basePath}?continue=${encodeURIComponent(
        router.asPath
      )}&reason=${reason}`
    )
  }

  handlePromiseRejection = (event) => {
    if (
      event.reason instanceof AuthorizationError ||
      event.reason instanceof UnauthorizedError
    ) {
      this.setState({ isAuthorized: false })
      this.redirectToLogin({
        reason: 'logout_unexpectedly',
      })
      // Don't report to console
      event.preventDefault()
    }

    // Forcing reload because Next.js subscribes to this even first
    if (event.reason instanceof NotFoundError) window.location.replace('/')
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
      .init()
      .then(() => {
        Sentry.configureScope((scope) => {
          scope.setUser({
            id: store.user.id,
            email: store.user.email,
          })
        })

        // Subscribe store to router after initialization
        // We use routeChangeComplete otherwise router.query contains previous
        // values
        router.events.on('routeChangeComplete', this.handleRouteChange)

        store.changeDataProvider(dataProviderId)
        this.setState({ isAuthorized: true })
      })
      .catch((error) => {
        if (error instanceof AuthorizationError) {
          this.setState({ isAuthorized: false })
          this.redirectToLogin({
            reason: '',
          })
        } else if (error instanceof AccessError) {
          // If the state is updated before route changes NextJS may render
          // the old component. Since we don't have any data for that provider
          // it may fail. (Works, DepositDates are not initialized...)
          router
            .replace('/data-providers')
            .then(() => this.setState({ isAuthorized: true }))
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
      this.redirectToLogin({
        reason: 'logout_unexpectedly',
      })
    }
  }

  AppShell = () => {
    const { store } = this
    const { Component, pageProps, router } = this.props
    const { isAuthorized } = this.state
    const pathname = router.asPath
    const variant =
      isAuthorized && !isRouteWithoutStore(pathname) ? 'internal' : 'public'

    let { acceptedTCVersion } = store.user
    if (acceptedTCVersion === 'None') acceptedTCVersion = 0
    if (typeof acceptedTCVersion == 'boolean' && acceptedTCVersion === false)
      acceptedTCVersion = 0
    if (typeof acceptedTCVersion == 'boolean' && acceptedTCVersion === true)
      acceptedTCVersion = 1

    if (!isAuthorized) {
      return (
        <Application
          dataProvider={undefined}
          pathname={pathname}
          variant={variant}
        >
          {isRouteWithoutStore(pathname) ? <Component {...pageProps} /> : null}
        </Application>
      )
    }

    return (
      <Application
        dataProvider={store.dataProvider}
        userID={store.user.id}
        user={store.user}
        seeAllNotifications={store.seeAllNotifications}
        pathname={pathname}
        variant={variant}
        tutorial={store.tutorial}
        getSetsEnabledList={store.getSetsEnabledList}
        enabledList={store.enabledList}
        isAuthenticated
        acceptedTCVersion={acceptedTCVersion}
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
