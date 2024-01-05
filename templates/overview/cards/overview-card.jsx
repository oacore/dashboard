import React from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { Icon } from '@oacore/design'

import styles from '../styles.module.css'

import Actions from 'components/actions'
import { Card } from 'design'

const OverviewCard = ({
  children,
  className,
  tooltip,
  title,
  downloadUrl,
  ...passProps
}) => (
  <Card
    className={classNames.use(styles.overviewCard, className)}
    {...passProps}
  >
    <div className={styles.cardHeader}>
      <Card.Title tag="h2">{title}</Card.Title>
      <Actions
        downloadUrl={downloadUrl}
        description={tooltip}
        hoverIcon={
          <Icon src="#alert-circle-outline" style={{ color: '#757575' }} />
        }
      />
    </div>
    {children}
  </Card>
)

export default OverviewCard
