import React from 'react'
import { AppBar } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import styles from './toggle.module.css'

const Toggle = React.memo(({ className, tag = 'button', ...restProps }) => (
  <AppBar.Item
    className={classNames.use(styles.container, className)}
    tag={tag}
    {...restProps}
  >
    <span className={styles.bar} />
    <span className={styles.bar} />
    <span className={styles.bar} />
  </AppBar.Item>
))

export default Toggle
