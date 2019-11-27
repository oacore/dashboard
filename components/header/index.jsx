import React from 'react'
import './index.css'
import AppHeader from '../../design/header'
import Avatar from '../../design/avatar'
import SearchBar from '../searchbar'
import Logo from '../../design/logo'

const Header = React.memo(({ className }) => {
  return (
    <AppHeader className={className}>
      <AppHeader.Item className="header-area-brand">
        <Logo />
        <button
          type="button"
          name="sidebar"
          value="show"
          className="menu-toggle"
        >
          <span />
          <span />
          <span />
        </button>
      </AppHeader.Item>
      <AppHeader.Item className="header-area-navigation">
        <SearchBar />
      </AppHeader.Item>
      <AppHeader.Item className="header-area-user">
        <Avatar />
      </AppHeader.Item>
    </AppHeader>
  )
})

export default Header
