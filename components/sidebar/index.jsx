import React from 'react'
import Link from 'next/link'
import { Icon } from '@oacore/design'

import Logo from '../../design/logo'
import sidebarClassNames from './index.css'
import layoutClassNames from '../layout/index.css'

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
      <div className={layoutClassNames.branding}>
        <Logo />
        <button
          type="button"
          aria-label="Close sidebar"
          name="sidebar"
          value="close"
          className={sidebarClassNames.close}
        />
      </div>
      <ul className={sidebarClassNames.sidebarNavigation}>
        {routes.map(route => (
          <li key={route.path}>
            <Link href={route.path}>
              <a className={sidebarClassNames.route} href="/">
                <Icon
                  alt={`${route.title} icon`}
                  src={`/design/icons.svg#${route.icon}`}
                />
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
