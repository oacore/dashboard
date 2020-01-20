import React from 'react'
import NextApp from 'next/app'
import { withRouter } from 'next/router'

import Route from './route'

import { initStore, GlobalProvider } from 'store'
import Application from 'components/application'

class App extends NextApp {
  static async getInitialProps({ Component, ctx }) {
    const store = initStore()
    let pageProps = {}
    // Provide the store to getInitialProps of pages
    if (Component.getInitialProps)
      pageProps = (await Component.getInitialProps({ ...ctx, store })) || {}

    return {
      pageProps,
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

  render() {
    const { Component, pageProps, router } = this.props

    const { dataProvider, activity } = new Route(router.asPath)

    const store = initStore()

    // needs to be done here because getInitialProps can be called before
    // handleNavigation (router.push) is done
    store.dataProvider = dataProvider
    store.activity = activity

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
