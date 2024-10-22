import React from 'react'

import {
  HeaderCard,
  CertificatesCard,
  StatusCard,
  StatusCardClosed,
} from './cards'
import styles from './styles.module.css'

export const USRNTemplateActivated = ({
  usrnParams,
  className,
  tag: Tag = 'main',
  ...restProps
}) => {
  const { template } = usrnParams

  return (
    <Tag className={[styles.container, className].join(' ')} {...restProps}>
      <HeaderCard usrnParams={usrnParams} />
      {template === 'fair' && <CertificatesCard usrnParams={usrnParams} />}
      <StatusCard usrnParams={usrnParams} />
    </Tag>
  )
}

export const USRNTemplateDeactivated = ({
  usrnParams,
  className,
  tag: Tag = 'main',
  ...restProps
}) => (
  <Tag className={[styles.container, className].join(' ')} {...restProps}>
    <HeaderCard usrnParams={usrnParams} />
    <StatusCardClosed />
  </Tag>
)

export default { USRNTemplateActivated, USRNTemplateDeactivated }
