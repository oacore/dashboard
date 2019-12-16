import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import Head from '../head'
import Header from '../header'
import Sidebar from '../sidebar'
import styles from './index.css'

const sidebarActions = ['toggle', 'open', 'close']
const mapSidebarActionToState = (actionName, state) =>
  ({
    toggle: !state,
    open: true,
    close: false,
  }[actionName])

const Layout = ({ children, className, tag: Tag = 'div', ...restProps }) => {
  const [isSidebarVisible, toggleSidebarVisibility] = useState(false)

  const handleSidebarToggle = event => {
    const issuer = event.target.closest('[value]')
    if (!issuer) return

    const { name, value } = issuer
    if (name === 'sidebar' && sidebarActions.includes(value))
      toggleSidebarVisibility(mapSidebarActionToState(value, isSidebarVisible))
  }

  return (
    <>
      <Head />
      <Tag
        className={classNames.use(styles.container, className)}
        onClick={handleSidebarToggle}
        {...restProps}
      >
        <Header />
        <Sidebar
          className={classNames
            .use('sidebar', { visible: isSidebarVisible })
            .from(styles)}
        />
        <main className={styles.main}>{children}</main>
      </Tag>
    </>
  )
}

export default Layout
