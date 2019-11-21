import React from 'react'
import logoPath from './core-symbol.svg'
import './logo.css'

const Logo = React.memo(() => (
  <a className="logo" href="/">
    <img src={logoPath} alt="CORE logo" />
    Dashboard
  </a>
))

export default Logo
