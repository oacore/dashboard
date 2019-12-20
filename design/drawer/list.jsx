import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.css'

const List = ({ children, className, tag: Tag = 'ul', ...restProps }) => (
  <Tag className={classNames.use(styles.list).join(className)} {...restProps}>
    {children}
  </Tag>
)

export default List
