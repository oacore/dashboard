import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.css'

const FlatItem = ({ children, className, tag: Tag = 'a', ...restProps }) => (
  <Tag className={classNames.use(styles.item).join(className)} {...restProps}>
    {children}
  </Tag>
)

const TreeItem = ({ children, ...passProps }) => (
  <li>
    <FlatItem {...passProps}>{children}</FlatItem>
  </li>
)

const Item = ({ children, tag = 'li', ...passProps }) => {
  const Component = tag === 'li' ? TreeItem : FlatItem
  return <Component {...passProps}>{children}</Component>
}

export default Item
