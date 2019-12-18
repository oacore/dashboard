import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './index.css'

const CloseIcon = ({ className, tag: Tag = 'span', ...restProps }) => (
  <Tag
    className={classNames.use(styles.close).join(className)}
    {...restProps}
  />
)

export default CloseIcon
