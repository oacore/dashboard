import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'

import { Card } from 'design'

const OverviewCard = ({ children, className, ...passProps }) => (
  <Card
    className={classNames.use(styles.overviewCard, className)}
    {...passProps}
  >
    {children}
  </Card>
)

export default OverviewCard
