import React from 'react'
import { AppBarItem } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import styles from './repository-select.css'

const RepositorySelect = ({ className, ...restProps }) => (
  <AppBarItem
    className={classNames.use(styles.container).join(className)}
    {...restProps}
  >
    <input
      type="text"
      value="Open Research Online - The Open University"
      placeholder="Search..."
    />
  </AppBarItem>
)

export default RepositorySelect
