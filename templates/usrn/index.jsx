import React from 'react'

import { HeaderCard, StatusCard } from './cards'
import styles from './styles.module.css'

const USRNTemplate = ({
  dataProviderName,
  billingPlan,
  dateReport,
  doiCount,
  totalDoiCount,
  className,
  tag: Tag = 'main',
  ...restProps
}) => (
  <Tag className={[styles.container, className].join(' ')} {...restProps}>
    <HeaderCard />
    <StatusCard
      dateReport={dateReport}
      doiCount={doiCount}
      totalDoiCount={totalDoiCount}
    />
  </Tag>
)

export default USRNTemplate
