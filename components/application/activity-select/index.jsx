import React from 'react'

import styles from './styles.css'

import { Icon, Drawer } from 'design'
import { navigation } from 'texts'

const toUrl = value => (value === 'index' ? '.' : `./${value}`)
const toIcon = value =>
  `/design/icons.svg#${
    {
      overview: 'overview',
      content: 'data',
      'deposit-dates': 'data',
    }[value]
  }`

const ActivitySelect = ({ children, value }) => (
  <Drawer.List>
    {React.Children.map(children, element =>
      React.cloneElement(element, {
        selected: element.props.value === value,
      })
    )}
  </Drawer.List>
)

const ActivitySelectOption = ({ children, value, selected }) => (
  <Drawer.Item className={styles[value]} href={toUrl(value)} active={selected}>
    {children || (
      <>
        <Icon className={styles.itemIcon} src={toIcon(value)} alt aria-hidden />
        {navigation.items[value]}
      </>
    )}
  </Drawer.Item>
)

ActivitySelect.Option = ActivitySelectOption

export default ActivitySelect
export { ActivitySelectOption as Option }
