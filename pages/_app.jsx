import React from 'react'
import NextApp from 'next/app'

import '@oacore/design/lib/index.css'

import Application from '../components/application'
import { initializeData, GlobalProvider } from '../store'

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
        <Application>
          <Component {...pageProps} />
        </Application>
      </GlobalProvider>
    )
  }
}

export default App
