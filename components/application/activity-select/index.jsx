import path from 'path'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import activities from '../activities'
import styles from './styles.module.css'

import { Icon, Drawer } from 'design'
import { navigation } from 'texts'

const toIcon = (value) => `#${activities.get(value).icon}`

const ActivitySelect = ({ children }) => (
  <Drawer.List className={styles.list}>{children}</Drawer.List>
)

const ActivitySelectOption = ({ children, value, selected }) => {
  const router = useRouter()
  return (
    <Link
      href={path.join('/data-providers/[data-provider-id]', value)}
      as={path.join('/data-providers', router.query['data-provider-id'], value)}
      passHref
    >
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
}

ActivitySelect.Option = ActivitySelectOption

export default ActivitySelect
export { ActivitySelectOption as Option }
