import React from 'react'
import { Icon } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'
import Actions from '../../../components/actions'

import { Card } from 'design'
import NumericValue, { formatNumber } from 'components/numeric-value'
import { valueOrDefault } from 'utils/helpers'

const ComplianceOptions = ({
  title,
  caption,
  description,
  button,
  value,
  subValue,
  percentageValue,
  icon,
  className,
  // possibleBonusCount,
}) => {
  const displayValue = valueOrDefault(
    value != null && !Number.isNaN(value) ? formatNumber(value) : null,
    'Loading...'
  )

  const roundedPercentageValue =
    percentageValue != null ? percentageValue.toFixed(2) : null

  const barFillClass = classNames.use(styles.percentageBarFill, {
    [styles.success]: title === 'Compliant',
    [styles.nonCompliant]: title === 'Non-compliant',
  })

  return (
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
      {roundedPercentageValue != null ? (
        <div className={styles.percentageBar}>
          <div
            className={barFillClass}
            style={{ width: `${roundedPercentageValue}%` }}
          >
            <span className={styles.valuePercentage}>
              {roundedPercentageValue}%
            </span>
          </div>
        </div>
      ) : (
        <NumericValue value={displayValue} className={styles.outputsMatch} />
      )}
      {button && button}
      {subValue && <span className={styles.subValue}>{subValue} outputs</span>}
    </Card>
  )
}

export default ComplianceOptions
