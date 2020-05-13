import React, { useContext } from 'react'
import { AppBar } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import LayoutContext from './context'
import styles from './styles.module.css'

import { Logo, Icon } from 'design'

const SideBar = ({
  children,
  className,
  tag: Tag = 'nav',
  id, // prevent passing ID to element attributes
  onClick,
  ...restProps
}) => {
  const [state, dispatch] = useContext(LayoutContext)

  const close = (event) => {
    const controlElementSelector = 'a, button, [type=submit], [type=button]'
    const controlElement = event.target.closest(controlElementSelector)
    if (controlElement != null) dispatch({ type: 'toggle_sidebar' })
  }

  const handleClick = (event) => {
    if (onClick) onClick(event)
    close(event)
  }

  return (
    <Tag
      id={state.sidebarId}
      className={classNames
        .use(styles['side-bar'], state.sidebarOpen && styles.open)
        .join(className)}
      onClick={handleClick}
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
          <Icon src="#close" alt="Close icon" aria-label="Close sidebar" />
        </AppBar.Item>
      </AppBar>

      {children}
    </Tag>
  )
}

export default SideBar
