import React, { useRef } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'

import { CloseIcon } from 'design'

class Sidebar extends React.Component {
  constructor(props) {
    super(props)
    const { children } = props
    if (children) React.Children.only(children)
  }

  render() {
    const { children, ...passProps } = this.props
    return (
      <div className={styles.sidebar}>
        {children && React.cloneElement(children, passProps)}
      </div>
    )
  }
}

const SidebarHeader = ({ children, className, ...passProps }) => {
  const closeIconRef = useRef(null)

  return (
    <div
      className={classNames.use([styles.header]).join(className)}
      {...passProps}
    >
      {children}
      <CloseIcon
        ref={closeIconRef}
        aria-label="Close table sidebar"
        onClick={() =>
          closeIconRef.current.dispatchEvent(
            new Event('sidebar-close', { bubbles: true })
          )
        }
        className={styles.closeIcon}
      />
    </div>
  )
}

const SidebarBody = ({ children, ...passProps }) => (
  <div {...passProps}>{children}</div>
)

const SidebarFooter = ({ children, className, ...passProps }) => (
  <div
    className={classNames.use([styles.footer]).join(className)}
    {...passProps}
  >
    {children}
  </div>
)

Sidebar.Header = SidebarHeader
Sidebar.Body = SidebarBody
Sidebar.Footer = SidebarFooter

export default Sidebar
