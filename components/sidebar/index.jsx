import React from 'react'
import Link from 'next/link'
import { AppBar, Icon } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import Logo from '../../design/logo'
import styles from './index.css'

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

const Sidebar = React.memo(({ className, tag: Tag = 'nav' }) => {
  return (
    <Tag className={classNames.use(styles.container).join(className)}>
      <AppBar className={styles.header}>
        <AppBar.Brand className={styles.brand} href="/">
          <Logo />
        </AppBar.Brand>
        <AppBar.Item type="button" name="sidebar" value="close" tag="button">
          <span className={styles.close} aria-label="Close sidebar" />
        </AppBar.Item>
      </AppBar>

      <ul className={styles.sidebarNavigation}>
        {routes.map(route => (
          <li key={route.path}>
            <Link href={route.path}>
              <a className={styles.route} href="/">
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
    </Tag>
  )
})

export default Sidebar
