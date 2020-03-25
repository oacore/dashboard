import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.css'

const LoadingBar = ({ className, tag: Tag = 'div' }) => (
  <Tag className={classNames.use(styles.container).join(className)} />
)

export default LoadingBar
