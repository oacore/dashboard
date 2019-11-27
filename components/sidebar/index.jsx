import React from 'react'
import './index.css'
import Logo from '../../design/logo'

const Sidebar = React.memo(({ className }) => {
  return (
    <nav className={className}>
      <div className="branding">
        <Logo />
        <button
          type="button"
          aria-label="Close sidebar"
          name="sidebar"
          value="close"
          className="close"
        />
      </div>
      <ul>
        <li>Overview</li>
        <li>Data</li>
        <li>Statistics</li>
        <li>Plugins</li>
        <li>Settings</li>
      </ul>
    </nav>
  )
})

export default Sidebar
