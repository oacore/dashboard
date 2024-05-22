import React from 'react'

import styles from './styles.module.css'

const USRNTemplate = ({
  dataProviderName,
  billingPlan,
  className,
  tag: Tag = 'main',
  ...restProps
}) => (
  <Tag className={[styles.container, className].join(' ')} {...restProps}>
    {dataProviderName}
  </Tag>
)

export default USRNTemplate
