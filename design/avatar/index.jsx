import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './index.css'

const Avatar = React.memo(
  ({ className, src = '/avatar.png', alt = 'User', ...restProps }) => (
    <img
      className={classNames.use(styles.avatar, className)}
      src={src}
      alt={alt}
      {...restProps}
    />
  )
)

export default Avatar
