import React, { useState } from 'react'
import classNames from 'classnames'
import Header from '../header'
import Head from '../head'
import './index.css'
import Sidebar from '../sidebar'

const Layout = ({ children }) => {
  const [isSidebarVisible, toggleSidebarVisibility] = useState(false)

  const handleCLick = e => {
    const { name, value } = e.target
    if (['sidebar.show', 'sidebar.close'].includes(`${name}.${value}`))
      toggleSidebarVisibility(!isSidebarVisible)
  }

  // TODO: Ask Viktor how aria should be handled
  /* eslint-disable */
  return (
    <>
      <Head />
      <div className="layout" onClick={handleCLick}>
        <Header className="layout-bar fixed" />
        <Sidebar
          className={classNames('layout-sidebar', {
            visible: isSidebarVisible,
          })}
        />
        <main className="layout-main">{children}</main>
      </div>
    </>
  )
  /* eslint-enable */
}

export default Layout
