import React from 'react'
import { Icon } from '@oacore/design'

import styles from '../styles.module.css'
import Actions from '../../../components/actions'

import { Button, Card } from 'design'
import NumericValue, { formatNumber } from 'components/numeric-value'
import { valueOrDefault } from 'utils/helpers'

const ComplianceOptions = ({
  title,
  caption,
  description,
  button,
  value,
  icon,
  className,
  // possibleBonusCount,
}) => (
  <Card className={styles.cardItem} tag="section" title={title}>
    <div className={styles.numberHeaderWrapper}>
      <div className={styles.innerTitle}>
        <div className={className}>{icon}</div>
        <div className={styles.titleWrapper}>
          <Card.Title tag="h2">{title}</Card.Title>
          <span>{caption}</span>
        </div>
      </div>
      <Actions
        className={styles.actionItem}
        description={description}
        hoverIcon={
          <Icon src="#alert-circle-outline" style={{ color: '#757575' }} />
        }
      />
    </div>
    <NumericValue
      value={valueOrDefault(formatNumber(value), 'Loading...')}
      caption={caption}
      className={styles.outputsMatch}
    />
    <Button tag="a" variant="contained" href="#cross-repository-check">
      {button}
    </Button>
  </Card>
)

export default ComplianceOptions
