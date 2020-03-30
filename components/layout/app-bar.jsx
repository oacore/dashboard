import React, { useContext } from 'react'
import { AppBar } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import LayoutContext from './context'
import styles from './styles.module.css'

import { AppBarToggle, Logo } from 'design'

const DashboardAppBar = ({
  children,
  className,
  variant = 'internal', // 'internal' or 'public'
  ...restProps
}) => {
  const [state, dispatch] = useContext(LayoutContext)

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
        aria-controls={state.sidebarId}
        aria-expanded={state.sidebarOpen}
        onClick={() => dispatch({ type: 'toggle_sidebar' })}
      />

      <AppBar.Brand className={styles.appBarBrand} href="/">
        <Logo />
      </AppBar.Brand>

      {children}
    </AppBar>
  )
}

export default DashboardAppBar
