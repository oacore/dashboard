import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'

const CardFooter = ({
  children,
  className,
  tag: Tag = 'div',
  ...restProps
}) => (
  <Tag className={classNames.use(styles.footer).join(className)} {...restProps}>
    {children}
  </Tag>
)

export default CardFooter
