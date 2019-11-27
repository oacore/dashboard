import React from 'react'
import Header from '../header'
import Head from '../head'
import './index.css'
import Sidebar from '../sidebar'

const Layout = ({ children }) => {
  return (
    <>
      <Head />
      <div className="layout">
        <Header className="layout-bar fixed" />
        <Sidebar className="layout-sidebar" />
        <main className="layout-main">{children}</main>
      </div>
    </>
  )
}

export default Layout
