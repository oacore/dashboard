import React from 'react'
import NextApp from 'next/app'
import { withRouter } from 'next/router'

import Route from './route'

import '@oacore/design/lib/index.css'

import { initStore, GlobalProvider } from 'store'
import Application from 'components/application'

class App extends NextApp {
  state = {
    isAuthorized: false,
    store: null,
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
    const pathname = '/login.html'
    window.location.replace(pathname)
  }

  async componentDidMount() {
    const store = initStore()

    try {
      await store.user.logIn()
      this.setState({ isAuthorized: true, store })
    } catch (error) {
      this.redirectToLogin()
    }
  }

  handleNavigation = event => {
    const link = event.target.closest('[href]')
    if (link == null) return

    const url = new URL(link.href)
    if (url.host !== window.location.host) return

    event.preventDefault()
    const route = new Route(url.pathname)
    this.props.router.push(route.href, route.as)
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
    const { Component, pageProps } = this.props
    const { isAuthorized, store } = this.state

    if (store === null || !isAuthorized) return null

    return (
      <GlobalProvider store={store}>
        <Application
          dataProvider={store.dataProvider}
          activity={store.activity}
          onClick={this.handleNavigation}
        >
          <Component {...pageProps} />
        </Application>
      </GlobalProvider>
    )
  }
}

export default withRouter(App)
