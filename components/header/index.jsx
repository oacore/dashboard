import React from 'react'
import './index.css'
import Logo from '../logo'
import AppHeader from '../../design/header'
import Avatar from '../../design/avatar'
import SearchBar from '../searchbar'

const Header = React.memo(({ className }) => {
  return (
    <AppHeader className={className}>
      <AppHeader.Item className="header-area-brand">
        <Logo />
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
