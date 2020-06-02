import React, { useRef } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'

import { Button, Icon } from 'design'

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
      className={classNames.use([styles.sidebarHeader]).join(className)}
      {...passProps}
    >
      {children}
      <Button
        ref={closeIconRef}
        className={styles.closeIcon}
        onClick={() =>
          closeIconRef.current.dispatchEvent(
            new Event('sidebar-close', { bubbles: true })
          )
        }
      >
        <Icon src="#close" alt="Close icon" aria-label="Close table sidebar" />
      </Button>
    </div>
  )
}

const SidebarBody = ({ children, className, ...passProps }) => (
  <div
    className={classNames.use(styles.sidebarBody).join(className)}
    {...passProps}
  >
    {children}
  </div>
)

const SidebarFooter = ({ children, className, ...passProps }) => (
  <div
    className={classNames.use(styles.sidebarFooter).join(className)}
    {...passProps}
  >
    {children}
  </div>
)

Sidebar.Header = SidebarHeader
Sidebar.Body = SidebarBody
Sidebar.Footer = SidebarFooter

export default Sidebar
