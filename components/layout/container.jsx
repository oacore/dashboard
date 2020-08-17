import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import { Provider as LayoutContext } from './context'
import styles from './styles.module.css'

const Container = ({
  children,
  className,
  variant,
  tag: Tag = 'div',
  ...restProps
}) => {
  const [state, update] = useState({
    sidebarId: 'sidebar',
    sidebarExpanded: false,
  })

  return (
    <Tag
      className={classNames
        .use('container', variant, state.sidebarExpanded)
        .from(styles)
        .join(className)}
      {...restProps}
    >
      <LayoutContext value={[state, update]}>{children}</LayoutContext>
    </Tag>
  )
}

export default Container
