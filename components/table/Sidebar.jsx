import React, { useRef } from 'react'

import tableClassNames from './index.css'

import { CloseIcon } from 'design'

class Sidebar extends React.Component {
  constructor(props) {
    super(props)
    const { children } = props
    if (children) React.Children.only(children)
  }

  render() {
    const { isOpen, children, ...passProps } = this.props
    return (
      <div className={tableClassNames.sidebar}>
        {children && React.cloneElement(children, passProps)}
      </div>
    )
  }
}

Sidebar.displayName = 'TableSidebar'

const SidebarHeader = ({ children, ...passProps }) => {
  const closeIconRef = useRef(null)

  return (
    <div {...passProps}>
      {children}
      <CloseIcon
        ref={closeIconRef}
        aria-label="Close table sidebar"
        onClick={() =>
          closeIconRef.current.dispatchEvent(
            new Event('sidebar-close', { bubbles: true })
          )
        }
        className={tableClassNames.closeIcon}
      />
    </div>
  )
}

Sidebar.Header = SidebarHeader

export default Sidebar
