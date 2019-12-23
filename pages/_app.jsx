import React from 'react'
import NextApp from 'next/app'
import Router from 'next/router'

import '@oacore/design/lib/index.css'

import Application from '../components/application'
import Route from '../components/application/route'
import NextRoute from '../components/application/next-route'
import { initializeData, GlobalProvider } from '../store'

const handleNavigation = event => {
  const link = event.target.closest('[href]')
  if (link == null) return

  const url = new URL(link.href)
  if (url.host !== window.location.host) return

  event.preventDefault()
  const args = Route.parse(url.pathname)
  const route = new NextRoute(...args)
  Router.push(route.href, route.as)
}

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

  render() {
    const { Component, pageProps, initialStoreData } = this.props

    return (
      <GlobalProvider initialData={initialStoreData}>
        <Application onClick={handleNavigation}>
          <Component {...pageProps} />
        </Application>
      </GlobalProvider>
    )
  }
}

export default App
