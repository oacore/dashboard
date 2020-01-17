import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './index.css'

const Overlay = ({
  children,
  className,
  blur = false,
  variant = 'light',
  tag: Tag = 'div',
  ...restProps
}) => (
  <Tag
    className={classNames
      .use('overlay', variant, { blur })
      .from(styles)
      .join(className)}
    {...restProps}
  >
    {children}
  </Tag>
)

export default Overlay
