import React from 'react'
import { AppBar } from '@oacore/design'

import { Consumer } from './context'
import styles from './styles.css'

import { AppBarToggle, Logo } from 'design'

const DashboardAppBar = ({ children, className, ...restProps }) => (
  <Consumer>
    {({ sidebarId, sidebarOpen, toggleSidebar }) => (
      <AppBar className={styles.appBar} fixed {...restProps}>
        <AppBarToggle
          className={styles.appBarToggle}
          type="button"
          aria-haspopup="true"
          aria-controls={sidebarId}
          aria-expanded={sidebarOpen}
          onClick={toggleSidebar}
        />

        <AppBar.Brand className={styles.appBarBrand} href="/">
          <Logo />
        </AppBar.Brand>

        {children}
      </AppBar>
    )}
  </Consumer>
)

export default DashboardAppBar
