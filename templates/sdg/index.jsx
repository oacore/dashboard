import React from 'react'
import { observer } from 'mobx-react-lite'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../rrs-policy/styles.module.css'
import DashboardHeader from '../../components/dashboard-header'
import texts from '../../texts/sdg/sdg.yml'

const SdgPageTemplate = observer(
  ({ tag: Tag = 'main', className, ...restProps }) => (
    <Tag className={classNames.use(styles.main).join(className)} {...restProps}>
      <DashboardHeader title={texts.title} description={texts.description} />
    </Tag>
  )
)
export default SdgPageTemplate
