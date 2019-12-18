import React from 'react'
import { AppBar } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import { Consumer } from './context'
import styles from './styles.css'

import { Logo, CloseIcon } from 'design'

const SideBar = ({
  children,
  className,
  tag: Tag = 'nav',
  id, // prevent passing ID to element attributes
  ...restProps
}) => (
  <Consumer>
    {({ sidebarId, sidebarOpen, toggleSidebar }) => (
      <Tag
        id={sidebarId}
        className={classNames
          .use(styles['side-bar'], sidebarOpen && styles.open)
          .join(className)}
        {...restProps}
      >
        <AppBar className={styles['side-bar-header']}>
          <AppBar.Brand className={styles['side-bar-header-brand']} href="/">
            <Logo />
          </AppBar.Brand>
          <AppBar.Item
            type="button"
            tag="button"
            onClick={() => toggleSidebar(false)}
          >
            <CloseIcon aria-label="Close sidebar" />
          </AppBar.Item>
        </AppBar>

        {children}
      </Tag>
    )}
  </Consumer>
)

export default SideBar
