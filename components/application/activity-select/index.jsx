import path from 'path'

import React from 'react'
import Link from 'next/link'

import activities from '../activities'
import styles from './styles.module.css'

import { Icon, Drawer } from 'design'
import { navigation } from 'texts'

const toIcon = (value) => `#${activities.get(value).icon}`

const ActivitySelect = ({ children }) => (
  <Drawer.List className={styles.list}>{children}</Drawer.List>
)

const ActivitySelectOption = ({
  children,
  value,
  selected,
  dataProviderId,
}) => (
  <Link
    href={path.join('/data-providers/[data-provider-id]', value)}
    as={path.join('/data-providers', String(dataProviderId), value)}
    passHref
  >
    <Drawer.Item
      className={styles[value]}
      active={selected}
      title={navigation.tooltips[value]}
    >
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
