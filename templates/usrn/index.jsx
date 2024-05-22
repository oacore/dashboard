import React from 'react'

import { HeaderCard, StatusCard } from './cards'
import styles from './styles.module.css'

const USRNTemplate = ({
  dataProviderName,
  billingPlan,
  className,
  tag: Tag = 'main',
  ...restProps
}) => (
  <Tag className={[styles.container, className].join(' ')} {...restProps}>
    <HeaderCard />
    <StatusCard />
  </Tag>
)

export default USRNTemplate
