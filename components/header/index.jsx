import React from 'react'
import { AppBar } from '@oacore/design'

import Avatar from '../../design/avatar'
import Logo from '../../design/logo'
import SearchBar from '../searchbar'
import AppBarToggle from './toggle'
import styles from './index.css'

const Header = React.memo(passProps => {
  return (
    <AppBar className={styles.container} fixed {...passProps}>
      <AppBarToggle
        className={styles.toggle}
        type="button"
        name="sidebar"
        value="toggle"
        aria-haspopup="true"
        aria-controls="toggle-sidebar"
        aria-expanded={false}
      />

      <AppBar.Brand className={styles.brandArea} href="/">
        <Logo />
      </AppBar.Brand>

      <SearchBar className={styles.navigationArea} />

      <AppBar.Item className={styles.userArea}>
        <Avatar />
      </AppBar.Item>
    </AppBar>
  )
})

export default Header
