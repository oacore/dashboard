import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import { Provider } from './context'
import styles from './styles.css'

const Container = ({ children, className, tag: Tag = 'div', ...restProps }) => {
  const [sidebarOpen, toggleSidebar] = useState(false)
  return (
    <Tag
      className={classNames
        .use(styles.container, sidebarOpen && styles.overlay)
        .join(className)}
      {...restProps}
    >
      <Provider
        value={{
          sidebarOpen,
          toggleSidebar: toggleSidebar.bind(!sidebarOpen),
          sidebarId: 'sidebar',
        }}
      >
        {children}
      </Provider>
    </Tag>
  )
}

export default Container
