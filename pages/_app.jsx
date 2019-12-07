import React from 'react'
import NextApp from 'next/app'

import Layout from '../components/layout'
import { initializeData, GlobalProvider } from '../stores'

import '@oacore/design/lib/index.css'
import './index.css'

class App extends NextApp {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    const initialStoreData = initializeData()

    // Provide the store to getInitialProps of pages
    if (Component.getInitialProps)
      pageProps = await Component.getInitialProps({ ...ctx })

    return {
      pageProps,
      initialStoreData,
    }
  }

  render() {
    const { Component, pageProps, initialStoreData } = this.props

    return (
      <GlobalProvider initialData={initialStoreData}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GlobalProvider>
    )
  }
}

export default App
