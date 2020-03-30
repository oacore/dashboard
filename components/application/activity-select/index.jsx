import React from 'react'
import Link from 'next/link'

import styles from './styles.module.css'

import { Icon, Drawer } from 'design'
import { navigation } from 'texts'
import activities from 'store/activities'

const linkProps = (value, dataProvider) => {
  if (value === 'index') {
    return {
      href: './',
    }
  }
  return {
    href: `/data-providers/[data-provider-id]/${value}`,
    as: `/data-providers/${dataProvider}/${value}`,
  }
}
const toIcon = (value) => `#${activities.get(value).icon}`

const ActivitySelect = ({ children }) => (
  <Drawer.List className={styles.list}>{children}</Drawer.List>
)

const ActivitySelectOption = ({
  children,
  value,
  selected,
  path,
  dataProvider,
}) => (
  <Link passHref {...linkProps(path, dataProvider)}>
    <Drawer.Item className={styles[value]} active={selected}>
      {children || (
        <>
          <Icon
            className={styles.itemIcon}
            src={toIcon(value)}
            alt=""
            aria-hidden
          />
          {navigation.items[value]}
        </>
      )}
    </Drawer.Item>
  </Link>
)

ActivitySelect.Option = ActivitySelectOption

export default ActivitySelect
export { ActivitySelectOption as Option }
