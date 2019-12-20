import React from 'react'
import { Icon } from '@oacore/design'

import styles from './activity-select.css'

import { Drawer } from 'design'

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

const ActivitySelect = passProps => (
  <Drawer.List {...passProps}>
    {routes.map(route => (
      <Drawer.Item key={route.path} href={route.path}>
        <Icon
          className={styles.itemIcon}
          alt={`${route.title} icon`}
          src={`/design/icons.svg#${route.icon}`}
        />
        {route.title}
      </Drawer.Item>
    ))}
  </Drawer.List>
)

export default ActivitySelect
