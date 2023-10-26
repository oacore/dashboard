import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import DocumentationBlockTemplate from './docs'

const DocumentationPageTemplate = ({
  membershipPlan,
  tag: Tag = 'main',
  className,
  headerDashboard,
  docs,
  ...restProps
}) => (
  <Tag
    className={classNames.use(styles.container).join(className)}
    {...restProps}
  >
    <article className={styles.content}>
      <DocumentationBlockTemplate
        headerDashboard={headerDashboard}
        docs={docs}
      />
    </article>
  </Tag>
)

export default DocumentationPageTemplate
