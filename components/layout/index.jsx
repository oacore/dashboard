import classNames from 'classnames'
import React, { useState } from 'react'

import Header from '../header'
import Sidebar from '../sidebar'
import Head from '../head'
import layoutClassNames from './index.css'

const Layout = ({ children }) => {
  const [isSidebarVisible, toggleSidebarVisibility] = useState(false)

  const handleCLick = event => {
    const { name, value } = event.target
    if (['sidebar.show', 'sidebar.close'].includes(`${name}.${value}`))
      toggleSidebarVisibility(!isSidebarVisible)
  }

  // TODO: Solve this better somehow
  // eslint-disable-next-line max-len
  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
  return (
    <>
      <Head />
      <div
        aria-haspopup="true"
        aria-controls="toggle-sidebar"
        aria-expanded={isSidebarVisible}
        className={layoutClassNames.layout}
        onClick={handleCLick}
      >
        <Header
          className={classNames(
            layoutClassNames.layoutBar,
            layoutClassNames.fixed
          )}
        />
        <Sidebar
          className={classNames(layoutClassNames.layoutSidebar, {
            [layoutClassNames.visible]: isSidebarVisible,
          })}
        />
        <main className={layoutClassNames.layoutMain}>{children}</main>
      </div>
    </>
  )
  // eslint-disable-next-line max-len
  /* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
}

export default Layout
