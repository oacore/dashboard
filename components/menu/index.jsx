import { classNames } from '@oacore/design/lib/utils'
import React, { forwardRef } from 'react'

import styles from './styles.module.css'

const MenuItem = ({ children, className, href, onClick, ...passProps }) => (
  <a
    href={href}
    className={classNames.use(styles.item).join(className)}
    {...passProps}
  >
    {children}
  </a>
)

const Menu = forwardRef(
  ({ children, className, visible, ...passProps }, ref) =>
    visible && (
      <div
        ref={ref}
        className={classNames.use(styles.menu).join(className)}
        {...passProps}
      >
        {children}
      </div>
    )
)

Menu.Item = MenuItem

export default Menu
