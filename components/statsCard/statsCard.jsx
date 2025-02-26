import React from 'react'
import { Icon } from '@oacore/design/lib/elements'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import { Button } from '../../design'
import { formatNumber } from '../../utils/helpers'
import Actions from '../actions'

import { Card } from 'design'

const StatsCard = ({
  title,
  description,
  action,
  tooltip,
  statUrl,
  statList,
  statLoading,
  noticeable,
  checkBillingType,
}) => (
  <Card className={styles.cardWrapper} tag="section" title={title}>
    <div>
      <div className={styles.headerWrapper}>
        <Card.Title className={styles.cardTitle} tag="h2">
          {title}
        </Card.Title>
        <Actions
          description={tooltip}
          hoverIcon={
            <Icon src="#alert-circle-outline" style={{ color: '#757575' }} />
          }
        />
      </div>
      <div className={styles.innerWrapper} />
      <Card.Description className={styles.cardDescription}>
        {description}
      </Card.Description>
    </div>
    <div>
      {statLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingStroke} />
        </div>
      ) : (
        <div
          className={classNames.use(styles.subFooter, {
            [styles.subFooterRed]: noticeable,
          })}
        >
          {formatNumber(statList.length)}
        </div>
      )}
    </div>
    <div className={styles.footerWrapper}>
      {!checkBillingType && (
        <Button href={statUrl} variant="contained">
          {action}
        </Button>
      )}
    </div>
  </Card>
)

export default StatsCard
