import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.css'

const FlatItem = ({
  children,
  className,
  active,
  tag: Tag = 'a',
  ...restProps
}) => (
  <Tag
    className={classNames
      .use(styles.item, active && styles.active)
      .join(className)}
    {...restProps}
  >
    {children}
  </Tag>
)

const TreeItem = ({ children, className, ...passProps }) => (
  <li className={className}>
    <FlatItem {...passProps}>{children}</FlatItem>
  </li>
)

const Item = ({ children, tag = 'li', ...passProps }) => {
  const Component = tag === 'li' ? TreeItem : FlatItem
  return <Component {...passProps}>{children}</Component>
}

export default Item
