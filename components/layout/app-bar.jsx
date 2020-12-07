import React from 'react'
import { AppBar } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import useSidebar from './use-sidebar'
import styles from './styles.module.css'

import { AppBarToggle, Logo } from 'design'

const DashboardAppBar = ({
  children,
  className,
  variant = 'internal', // 'internal' or 'public'
  ...restProps
}) => {
  const sidebar = useSidebar()

  return (
    <AppBar
      className={classNames.use('appBar', variant).from(styles)}
      fixed
      {...restProps}
    >
      <AppBarToggle
        className={styles.appBarToggle}
        type="button"
        aria-haspopup="true"
        aria-controls={sidebar.id}
        aria-expanded={sidebar.isOpen}
        onClick={sidebar.open}
      />

      <AppBar.Brand className={styles.appBarBrand} href="/">
        <Logo className={styles.logo}>Dashboard</Logo>
      </AppBar.Brand>

      {children}
    </AppBar>
  )
}

export default DashboardAppBar
