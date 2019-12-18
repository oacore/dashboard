import React from 'react'
import Link from 'next/link' // TODO: Should be avoided
import { Icon } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import styles from './activity-select.css'

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

const ActivitySelect = React.memo(({ className }) => (
  <ul className={classNames.use(styles.sidebarNavigation).join(className)}>
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
))

export default ActivitySelect
