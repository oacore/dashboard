import React from 'react'

import styles from './styles.css'

import { Icon, Drawer } from 'design'
import { navigation } from 'texts'
import activities from 'store/activities'

const toUrl = (value, dataProvider) =>
  value === 'index' ? `./` : `/data-providers/${dataProvider}/${value}`
const toIcon = value => `/design/icons.svg#${activities.get(value).icon}`

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
  <Drawer.Item
    className={styles[value]}
    href={toUrl(path, dataProvider)}
    active={selected}
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
)

ActivitySelect.Option = ActivitySelectOption

export default ActivitySelect
export { ActivitySelectOption as Option }
