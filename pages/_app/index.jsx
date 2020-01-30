import React from 'react'
import NextApp from 'next/app'
import { withRouter } from 'next/router'
import { autorun } from 'mobx'

import Route from './route'

import '@oacore/design/lib/index.css'

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

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    // Provide the store to getInitialProps of pages
    if (Component.getInitialProps)
      pageProps = (await Component.getInitialProps({ ...ctx })) || {}

    return {
      pageProps,
    }
  }

  redirectToLogin = () => {
    window.location.replace('/login.html')
  }

  reflectStoreToRoute() {
    const { store } = this
    const { router } = this.props

    if (store == null) return

    const route = new Route({
      dataProvider: store.dataProvider?.id,
      activity: store.activity?.path,
    })

    // TODO: This probably should be under condition
    router.push(route.href, route.as)
  }

  async componentDidMount() {
    const store = initStore()

    // Assumes store object is always the same
    this.store = store
    this.disposeRouter = autorun(this.reflectStoreToRoute.bind(this))

    try {
      const { dataProvider, activity } = new Route(window.location.pathname)
      await store.init(dataProvider, activity)
      this.setState({ isAuthorized: true })

      Sentry.configureScope(scope => {
        scope.setUser({
          id: store.user.id,
          email: store.user.email,
        })
      })
    } catch (unauthorizedError) {
      // TODO: Do some check before redirect
      this.redirectToLogin()
    }
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

  render() {
    const { store } = this
    const { isAuthorized } = this.state
    const { Component, pageProps } = this.props

    if (store == null || !isAuthorized) return null

    return (
      <GlobalProvider store={store}>
        <Application
          dataProvider={store.dataProvider}
          activity={store.activity.path}
          onClick={this.handleNavigation}
        >
          <Component {...pageProps} />
        </Application>
      </GlobalProvider>
    )
  }
}

export default withRouter(App)
