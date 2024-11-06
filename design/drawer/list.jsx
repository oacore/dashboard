import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'

const List = ({ children, className, tag: Tag = 'ul', ...restProps }) => (
  <Tag
    className={classNames.use(styles.barMenuList).join(className)}
    {...restProps}
  >
    {children}
  </Tag>
)

export default List
