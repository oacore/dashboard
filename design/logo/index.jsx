import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import logoPath from './core-symbol.svg'
import styles from './index.css'

const Logo = React.memo(
  ({
    children = 'Dashboard',
    className,
    src = logoPath,
    alt = 'CORE',
    tag: Tag = 'span',
    ...restProps
  }) => (
    <Tag className={classNames.use(styles.logo, className)} {...restProps}>
      <img src={src} alt={alt} />
      {children}
    </Tag>
  )
)

export default Logo
