import React from 'react'
import classNames from 'classnames'

import logoPath from './core-symbol.svg'
import logoClassNames from './index.css'

const Logo = React.memo(({ className }) => (
  <a className={classNames(logoClassNames.logo, className)} href="/">
    <img src={logoPath} alt="CORE logo" />
    Dashboard
  </a>
))

export default Logo
