import React from 'react'
import classNames from 'classnames'
import './index.css'

const Header = React.memo(({ className, children }) => (
  <header className={classNames('header', className)}>{children}</header>
))

const HeaderItem = React.memo(({ className, children }) => (
  <div className={classNames('header-item', className)}>{children}</div>
))

Header.Item = HeaderItem

export default Header
