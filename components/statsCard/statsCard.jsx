import React from 'react'
import { Button } from '@oacore/design'

import styles from './styles.module.css'
import Actions from '../actions'
import { formatNumber } from '../../utils/helpers'

import infoAction from 'components/upload/assets/infoAction.svg'
import { Card } from 'design'

const StatsCard = ({
  title,
  description,
  count,
  loading,
  actionText,
  actionHref,
  showAction = true,
  showInfo = false,
  infoText,
  checkBillingType,
  countClassName,
}) => (
  <Card className={styles.cardWrapper} tag="section" title={title}>
    <div>
      <div className={styles.headerWrapper}>
        <Card.Title className={styles.cardTitle} tag="h2">
          {title}
        </Card.Title>
        {showInfo && (
          <Actions
            description={infoText}
            hoverIcon={
              <img src={infoAction} style={{ color: '#757575' }} alt="" />
            }
          />
        )}
      </div>
      <Card.Description className={styles.cardDescription}>
        {description}
      </Card.Description>
    </div>
    <div>
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingStroke} />
        </div>
      ) : (
        <div className={styles.innerContent}>
          <p className={countClassName || styles.subFooter}>
            {formatNumber(count)}
          </p>
        </div>
      )}
    </div>
    <div className={styles.footerWrapper}>
      {showAction && !checkBillingType && (
        <Button href={actionHref} variant="contained">
          {actionText}
        </Button>
      )}
    </div>
  </Card>
)

export default StatsCard
