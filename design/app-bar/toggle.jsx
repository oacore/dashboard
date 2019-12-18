import React from 'react'
import { AppBarItem } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import styles from './toggle.css'

const Toggle = React.memo(({ className, tag = 'button', ...restProps }) => (
  <AppBarItem
    className={classNames.use(styles.container, className)}
    tag={tag}
    {...restProps}
  >
    <span className={styles.bar} />
    <span className={styles.bar} />
    <span className={styles.bar} />
  </AppBarItem>
))

export default Toggle
