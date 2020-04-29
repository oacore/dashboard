import React from 'react'
import { AppBar } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import styles from './toggle.module.css'

import { Icon } from 'design'

const Toggle = React.memo(({ className, tag = 'button', ...restProps }) => (
  <AppBar.Item
    className={classNames.use(styles.container, className)}
    tag={tag}
    {...restProps}
  >
    <Icon src="#menu" alt="Menu icon" aria-hidden />
  </AppBar.Item>
))

export default Toggle
