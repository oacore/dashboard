import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'
import Actions from '../../../components/actions'
import { ProgressSpinner } from '../../../design'

import infoAction from 'components/upload/assets/infoAction.svg'
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
  hasTooltip,
  isRetrieveDepositDatesInProgress,
}) => {
  const displayValue = valueOrDefault(
    value != null && !Number.isNaN(value) ? formatNumber(value) : null,
    'Loading...'
  )

  const displaySubValue = valueOrDefault(
    subValue != null && !Number.isNaN(subValue) ? formatNumber(subValue) : null,
    'Loading...'
  )

  const roundedPercentageValue =
    percentageValue != null ? percentageValue.toFixed(2) : null

  const barFillClass = classNames.use(styles.percentageBarFill, {
    [styles.success]: title === 'Compliant',
    [styles.nonCompliant]: title === 'Non-compliant',
  })

  const shouldShowSubValue =
    (subValue !== undefined && subValue !== null) ||
    (isRetrieveDepositDatesInProgress && subValue !== undefined)

  const getRoundedPercentageValue = () => {
    switch (true) {
      case roundedPercentageValue != null && isRetrieveDepositDatesInProgress:
        return (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingStroke} />
          </div>
        )

      case roundedPercentageValue != null:
        return (
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
        )

      case isRetrieveDepositDatesInProgress:
        return <ProgressSpinner className={styles.spinner} />

      default:
        return (
          <NumericValue value={displayValue} className={styles.outputsMatch} />
        )
    }
  }

  return (
    <Card className={styles.cardItem} tag="section" title={title}>
      <div className={styles.numberHeaderWrapper}>
        <div className={styles.innerTitle}>
          <div className={className}>{icon}</div>
          <div className={styles.titleWrapper}>
            <Card.Title tag="h2" className={styles.cardTitle}>
              {title}
            </Card.Title>
            <span>{caption}</span>
          </div>
        </div>
        {hasTooltip && (
          <Actions
            className={styles.actionItem}
            description={description}
            hoverIcon={
              <img src={infoAction} style={{ color: '#757575' }} alt="" />
            }
          />
        )}
      </div>
      {getRoundedPercentageValue()}
      {button && button}
      {shouldShowSubValue && (
        <span className={styles.subValue}>
          {isRetrieveDepositDatesInProgress ? (
            <ProgressSpinner className={styles.spinnerSmall} />
          ) : (
            `${displaySubValue}`
          )}{' '}
          outputs
        </span>
      )}
    </Card>
  )
}

export default ComplianceOptions
