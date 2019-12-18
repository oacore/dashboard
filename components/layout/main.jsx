import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.css'

const Main = ({ children, className, tag: Tag = 'main', ...restProps }) => (
  <Tag className={classNames.use(styles.main).join(className)} {...restProps}>
    {children}
  </Tag>
)

export default Main
