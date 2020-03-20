import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.css'

const DetailList = React.memo(({ children, className, ...passProps }) => (
  <ul
    className={classNames.use(styles.container).join(className)}
    {...passProps}
  >
    {children}
  </ul>
))

const DetailItem = React.memo(({ name, className, children, ...passProps }) => (
  <li className={classNames.use([styles.item]).join(className)} {...passProps}>
    <div className={styles.header}>{name}</div>
    <div className={styles.content}>{children}</div>
  </li>
))

DetailList.Item = DetailItem

export default DetailList
