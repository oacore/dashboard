import React, { useCallback } from 'react'
import { AppBar } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import useSidebar from './use-sidebar'
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
  const sidebar = useSidebar()

  const handleControlClick = useCallback((event) => {
    const controlElementSelector = 'a, button, [type=submit], [type=button]'
    const controlElement = event.target.closest(controlElementSelector)
    if (controlElement != null) sidebar.close()
  }, [])

  const handleClick = useCallback((event) => {
    if (onClick) onClick(event)
    handleControlClick(event)
  }, [])

  return (
    <Tag
      id={sidebar.id}
      className={classNames
        .use(styles.sideBar, sidebar.isOpen && styles.open)
        .join(className)}
      onClick={handleClick}
      {...restProps}
    >
      <AppBar className={styles.sideBarHeader}>
        <AppBar.Brand className={styles.sideBarHeaderBrand} href="/">
          <Logo />
        </AppBar.Brand>
        <AppBar.Item type="button" tag="button">
          <Icon src="#close" alt="Close" aria-label="Close sidebar" />
        </AppBar.Item>
      </AppBar>

      {children}
    </Tag>
  )
}

export default SideBar
