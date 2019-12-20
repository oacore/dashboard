import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './index.css'

const Card = ({ children, className, tag: Tag = 'div', ...restProps }) => (
  <Tag
    className={classNames.use(styles.container).join(className)}
    {...restProps}
  >
    {children}
  </Tag>
)

export default Card
