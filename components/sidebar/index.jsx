import React from 'react'
import './index.css'
import Link from 'next/link'

import Logo from '../../design/logo'
import Icon from '../../design/icons/Icon'

const routes = [
  {
    path: '/',
    icon: 'overview',
    title: 'Overview',
  },
  {
    path: '/data',
    icon: 'data',
    title: 'Data',
  },
  {
    path: '/statistics',
    icon: 'statistics',
    title: 'Statistics',
  },
  {
    path: '/plugins',
    icon: 'plugins',
    title: 'Plugins',
  },
  {
    path: '/settings',
    icon: 'settings',
    title: 'Settings',
  },
]

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
      <ul className="sidebar-navigation">
        {routes.map(route => (
          <li>
            <Link href={route.path}>
              <a className="route" href="/">
                <Icon iconType={route.icon} />
                {route.title}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
})

export default Sidebar
