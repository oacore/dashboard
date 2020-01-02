import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.css'

const Main = ({ children }) => {
  const child = React.Children.only(children)
  const { className, tag } = child.props
  return React.cloneElement(child, {
    className: classNames.use(styles.main).join(className),
    tag: tag || 'main',
  })
}

export default Main
