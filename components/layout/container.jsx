import React, { useReducer } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import { Provider } from './context'
import styles from './styles.module.css'

const reducer = (state, action) => {
  switch (action.type) {
    case 'toggle_sidebar':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    default:
      throw new Error()
  }
}

const Container = ({ children, className, tag: Tag = 'div', ...restProps }) => {
  const [state, dispatch] = useReducer(reducer, {
    sidebarOpen: false,
    sidebarId: 'sidebar',
  })

  return (
    <Tag
      className={classNames
        .use(styles.container, state.sidebarOpen && styles.overlay)
        .join(className)}
      {...restProps}
    >
      <Provider value={[state, dispatch]}>{children}</Provider>
    </Tag>
  )
}

export default Container
