import React from 'react'
import NextApp from 'next/app'
import { withRouter } from 'next/router'

import Route from './route'

import '@oacore/design/lib/index.css'

import { initStore, GlobalProvider } from 'store'
import Application from 'components/application'

class App extends NextApp {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    // Provide the store to getInitialProps of pages
    if (Component.getInitialProps)
      pageProps = (await Component.getInitialProps({ ...ctx })) || {}

    return {
      pageProps,
    }
  }

  store = null

  componentDidMount() {
    const { router } = this.props
    const { dataProvider, activity } = new Route(router.asPath)
    this.store = initStore({ dataProvider, activity })
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
    const { store } = this

    if (store === null) return null

    const { dataProvider, activity } = new Route(router.asPath)

    store.dataProvider = dataProvider
    store.activity = activity

    return (
      <GlobalProvider store={store}>
        <Application
          dataProvider={dataProvider}
          activity={activity}
          onClick={this.handleNavigation}
        >
          <Component {...pageProps} />
        </Application>
      </GlobalProvider>
    )
  }
}

export default withRouter(App)
