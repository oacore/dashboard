import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'

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

const Item = React.forwardRef(({ children, tag = 'li', ...passProps }, ref) => {
  const Component = tag === 'li' ? TreeItem : FlatItem
  return (
    <Component ref={ref} {...passProps}>
      {children}
    </Component>
  )
})

export default Item
