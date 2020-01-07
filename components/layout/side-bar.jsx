import React, { useContext } from 'react'
import { AppBar } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import LayoutContext from './context'
import styles from './styles.css'

import { Logo, CloseIcon } from 'design'

const SideBar = ({
  children,
  className,
  tag: Tag = 'nav',
  id, // prevent passing ID to element attributes
  ...restProps
}) => {
  const [state, dispatch] = useContext(LayoutContext)
  return (
    <Tag
      id={state.sidebarId}
      className={classNames
        .use(styles['side-bar'], state.sidebarOpen && styles.open)
        .join(className)}
      {...restProps}
    >
      <AppBar className={styles.sideBarHeader}>
        <AppBar.Brand className={styles.sideBarHeaderBrand} href="/">
          <Logo />
        </AppBar.Brand>
        <AppBar.Item
          type="button"
          tag="button"
          onClick={() => dispatch({ type: 'toggle_sidebar' })}
        >
          <CloseIcon aria-label="Close sidebar" />
        </AppBar.Item>
      </AppBar>

      {children}
    </Tag>
  )
}

export default SideBar
