import React from 'react'
import classNames from 'classnames'

import headerClassNames from './index.css'

const Header = React.memo(({ className, children }) => (
  <header className={classNames(headerClassNames.header, className)}>
    {children}
  </header>
))

const HeaderItem = React.memo(({ className, children }) => (
  <div className={classNames(headerClassNames.headerItem, className)}>
    {children}
  </div>
))

Header.Item = HeaderItem

export default Header
