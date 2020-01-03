import React from 'react'
import NextApp from 'next/app'
import { withRouter } from 'next/router'

import '@oacore/design/lib/index.css'

import Route from './route'
import { initializeData, GlobalProvider } from '../../store'

import Application from 'components/application'

class App extends NextApp {
  static async getInitialProps({ Component, ctx }) {
    const initialStoreData = initializeData()
    let pageProps = {}

    // Provide the store to getInitialProps of pages
    if (Component.getInitialProps) {
      pageProps =
        (await Component.getInitialProps({ ...ctx, initialStoreData })) || {}
    }

    return {
      pageProps,
      initialStoreData,
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
    const { Component, pageProps, initialStoreData, router } = this.props

    const { dataProvider, activity } = new Route(router.asPath)

    return (
      <GlobalProvider initialData={initialStoreData}>
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
