import React from 'react'
import './index.css'

const Sidebar = React.memo(({ className }) => {
  return (
    <nav className={className}>
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
