import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './index.module.css'

const CloseIcon = React.forwardRef(
  ({ className, tag: Tag = 'span', ...restProps }, ref) => (
    <Tag
      ref={ref}
      className={classNames.use(styles.close).join(className)}
      {...restProps}
    />
  )
)

export default CloseIcon
