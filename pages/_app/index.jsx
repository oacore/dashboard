import React from 'react'
import NextApp from 'next/app'
import { withRouter } from 'next/router'
import { autorun } from 'mobx'

import '@oacore/design/lib/index.css'

import Route from './route'
import styles from './index.css'

import { getLoginPage } from 'config'
import { UnauthorizedError } from 'api/errors'
import logPageView from 'utils/analytics'
import { initStore, GlobalProvider } from 'store'
import Application from 'components/application'
import { Sentry } from 'utils/sentry'

process.on('unhandledRejection', err => {
  Sentry.captureException(err)
})

process.on('uncaughtException', err => {
  Sentry.captureException(err)
})

class App extends NextApp {
  state = {
    isAuthorized: false,
  }

  loginIframeRef = React.createRef()

  handleRouteChange = url => {
    logPageView(url)
    const { dataProvider, activity } = new Route(url)

    if (dataProvider) {
      this.store.changeDataProvider(dataProvider)
      this.store.changeActivity(activity)
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

  redirectToLogin = path => {
    window.location.replace(getLoginPage(path))
  }

  handlePromiseRejection = event => {
    if (event.reason instanceof UnauthorizedError) {
      this.redirectToLogin(window.location.href)
      // Don't report to console
      event.preventDefault()
    }
  }

  handlePostMessage = async event => {
    if (event.data === 'login-processing' && !this.state.isAuthorized)
      await this.fetchUser()
  }

  reflectStoreToRoute = () => {
    const { store } = this
    const { router } = this.props

    const route = new Route({
      dataProvider: store.dataProvider?.id,
      activity: store.activity?.path,
    })

    if (route.as !== window.location.pathname) router.push(route.href, route.as)
  }

  async fetchUser() {
    try {
      const { dataProvider, activity } = new Route(window.location.pathname)
      await this.store.init(dataProvider, activity)
      this.setState({ isAuthorized: true })

      Sentry.configureScope(scope => {
        scope.setUser({
          id: this.store.user.id,
          email: this.store.user.email,
        })
      })
    } catch (unauthorizedError) {
      // TODO: Do some check before redirect
      this.setState({ isAuthorized: false })
    } finally {
      if (this.loginIframeRef.current) {
        this.loginIframeRef.current.contentWindow.postMessage(
          'login-finished',
          '*'
        )
      }
    }
  }

  async componentDidMount() {
    const store = initStore()
    const { router } = this.props
    router.events.on('routeChangeComplete', this.handleRouteChange)
    window.addEventListener('unhandledrejection', this.handlePromiseRejection)
    window.addEventListener('message', this.handlePostMessage)

    // Assumes store object is always the same
    this.store = store
    autorun(this.reflectStoreToRoute)
    await this.fetchUser()
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
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key])
        scope.setExtra('ssr', false)
      })
      scope.setExtra('dataProvider', this.store.dataProvider)
      scope.setExtra('activity', this.store.activity)

      Sentry.captureException(error)
    })

    if (error instanceof UnauthorizedError)
      window.location.replace(getLoginPage(window.location.href))
  }

  handleNavigation = event => {
    const link = event.target.closest('[href]')
    if (link == null) return

    const url = new URL(link.href)
    if (url.host !== window.location.host) return

    event.preventDefault()
    const route = new Route(url.pathname)
    if (route.dataProvider != null)
      this.store.changeDataProvider(route.dataProvider)
    this.store.changeActivity(route.activity || 'overview')
  }

  static getDerivedStateFromProps(props, state) {
    const { router } = props
    const { store } = state

    if (!store) return null
    const { dataProvider, activity } = new Route(router.asPath)

    store.dataProvider = dataProvider
    store.activity = activity
    return null
  }

  Login = () => (
    <iframe
      ref={this.loginIframeRef}
      title="Login Form"
      src="/login.html?loading"
      className={styles.loginIframe}
    />
  )

  render() {
    const { store } = this
    const { isAuthorized } = this.state
    const { Component, pageProps } = this.props
    const { Login } = this

    if (store == null || !isAuthorized) {
      return (
        <>
          <Application
            dataProvider={undefined}
            activity="overview"
            onClick={this.handleNavigation}
          />
          <Login />
        </>
      )
    }

    return (
      <GlobalProvider store={store}>
        <Application
          dataProvider={store.dataProvider}
          activity={store.activity.id}
          onClick={this.handleNavigation}
        >
          <Component {...pageProps} />
        </Application>
      </GlobalProvider>
    )
  }
}

export default withRouter(App)
