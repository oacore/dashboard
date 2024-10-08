import React from 'react'

import { HeaderCard, StatusCard, StatusCardClosed } from './cards'
import styles from './styles.module.css'

export const USRNTemplateActivated = ({
  usrnParams,
  className,
  tag: Tag = 'main',
  ...restProps
}) => (
  <Tag className={[styles.container, className].join(' ')} {...restProps}>
    <HeaderCard />
    <StatusCard usrnParams={usrnParams} />
  </Tag>
)

export const USRNTemplateDeactivated = ({
  className,
  tag: Tag = 'main',
  ...restProps
}) => (
  <Tag className={[styles.container, className].join(' ')} {...restProps}>
    <HeaderCard />
    <StatusCardClosed />
  </Tag>
)

export default { USRNTemplateActivated, USRNTemplateDeactivated }
