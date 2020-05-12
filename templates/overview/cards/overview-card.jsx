import React from 'react'

import styles from '../styles.module.css'

import { Card } from 'design'

const OverviewCard = ({ children, className, ...passProps }) => (
  <Card className={styles.overviewCard} {...passProps}>
    {children}
  </Card>
)

export default OverviewCard
