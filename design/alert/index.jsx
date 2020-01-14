import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import Card from '../card'
import styles from './index.css'

const Alert = React.memo(({ children, variant }) => (
  <Card
    className={classNames
      .use({
        alert: true,
        'alert-danger': variant === 'danger',
        'alert-info': variant === 'info',
      })
      .from(styles)}
  >
    {children}
  </Card>
))

const AlertHeader = React.memo(({ children, className }) => (
  <Card
    className={classNames
      .use('alert-header')
      .from(styles)
      .join(className)}
  >
    {children}
  </Card>
))

const AlertContent = React.memo(({ children, className }) => (
  <Card
    className={classNames
      .use('alert-content')
      .from(styles)
      .join(className)}
  >
    {children}
  </Card>
))

Alert.Header = AlertHeader
Alert.Content = AlertContent

export default Alert
