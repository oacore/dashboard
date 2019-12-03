import React from 'react'

import AppHeader from '../../design/header'
import Avatar from '../../design/avatar'
import SearchBar from '../searchbar'
import Logo from '../../design/logo'
import headerClassNames from './index.css'

const Header = React.memo(({ className }) => {
  return (
    <AppHeader className={className}>
      <AppHeader.Item className={headerClassNames.headerAreaBrand}>
        <Logo className={headerClassNames.headerItemLogo} />
        <button
          id="toggle-sidebar"
          type="button"
          name="sidebar"
          value="show"
          className={headerClassNames.menuToggle}
        >
          <span className={headerClassNames.bar} />
          <span className={headerClassNames.bar} />
          <span className={headerClassNames.bar} />
        </button>
      </AppHeader.Item>
      <AppHeader.Item className={headerClassNames.headerAreaNavigation}>
        <SearchBar />
      </AppHeader.Item>
      <AppHeader.Item className={headerClassNames.headerAreaUser}>
        <Avatar />
      </AppHeader.Item>
    </AppHeader>
  )
})

export default Header
