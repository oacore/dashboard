import React from 'react'
import { Card, Button, Skeleton, Spin } from 'antd'
import { InfoTooltip } from '@oacore/core-ui';
import "./styles.css"
import classNames from 'classnames';
import { valueOrDefault, formatNumber } from '@/utils/helpers';
import {LoadingOutlined} from '@ant-design/icons';

interface CrStatsCardProps {
  title: string
  description?: string | false
  caption?: string
  count?: number
  value?: number
  subValue?: number
  percentageValue?: number
  percentMode?: boolean
  iconTitleMode?: boolean
  countText?: string
  footerText?: string
  loading?: boolean
  actionText?: string
  actionHref?: string
  showAction?: boolean
  showInfo?: boolean
  infoText?: string
  countClassName?: string
  wholeWidthCard?: boolean
  isStartingPlan?: boolean
  onActionClick?: (() => void) | false
  actionLoading?: boolean
  tempDisabled?: React.ReactNode | false
  error?: Error | null
  icon?: React.ReactNode
  button?: React.ReactNode
  className?: string
  iconClassName?: string
}

export const CrStatsCard: React.FC<CrStatsCardProps> = ({
  title,
  description = false,
  caption,
  count,
  value,
  subValue,
  percentageValue,
  percentMode = false,
  iconTitleMode = false,
  countText,
  footerText,
  loading = false,
  actionText,
  isStartingPlan,
  actionHref,
  showAction = true,
  showInfo = false,
  infoText,
  countClassName,
  wholeWidthCard,
  onActionClick = false,
  actionLoading = false,
  tempDisabled = false,
  error = null,
  icon,
  button,
  className,
  iconClassName,
}) => {
  const cardContainerClass = wholeWidthCard
    ? 'card-container card-container-whole'
    : 'card-container card-container-default'

  const valueResult = valueOrDefault(value, 'Loading...')
  const displayValue = typeof valueResult === 'number' ? formatNumber(valueResult) : valueResult

  const subValueResult = valueOrDefault(subValue, 'Loading...')
  const displaySubValue = typeof subValueResult === 'number' ? formatNumber(subValueResult) : subValueResult

  const roundedPercentageValue =
    percentageValue != null ? percentageValue.toFixed(2) : null

  const percentValue = percentageValue != null
    ? Math.min(Math.max(parseFloat(roundedPercentageValue || '0'), 0), 100)
    : Math.min(Math.max(count || 0, 0), 100)

  const isSuccessCheck = percentValue > 20
  const isCompliant = title === 'Compliant' || title === 'Outputs with a DOI'
  const isNonCompliant = title === 'Non-compliant' || title === 'Outputs without a DOI'

  const renderHeader = () => (
    <div className="cr-header-wrapper">
      <div className="header-left">
        {icon && <div
          className={classNames('cr-icon-wrapper', iconClassName)}
        >{icon}</div>}
        <div className="cr-title-wrapper">
          <h2 className="card-title">{title}</h2>
          {caption && <span className="card-description">{caption}</span>}
        </div>
      </div>
      <div className="header-right">
        {(showInfo) && infoText && <InfoTooltip title={infoText} />}
      </div>
    </div>
  )

  const getRoundedPercentageValue = () => {
    switch (true) {
      case roundedPercentageValue != null && loading:
        return (
          <div className="loading-container">
            <div className="loading-stroke" />
          </div>
        )

      case roundedPercentageValue != null: {
        const barFillClass = classNames('progress-bar__fill', {
          'progress-bar__fill--success': isCompliant,
          'progress-bar__fill--nonCompliant': isNonCompliant,
        })

        return (
          <div className="progress-bar">
            <div
              className={barFillClass}
              style={{ width: `${roundedPercentageValue}%` }}
            >
              <span className="progress-bar__label">{roundedPercentageValue}%</span>
            </div>
          </div>
        )
      }

      case loading:
        return <Spin  indicator={<LoadingOutlined spin />} className="spinner" />

      default:
        return (
          <div className={`sub-footer ${countClassName || ''}`}>
            {displayValue}
          </div>
        )
    }
  }

  const renderContent = () => {
    if (error) {
      return (
        <p className="no-data-message cr-stats-card-error-message">
          Failed to load data. Please try again later.
        </p>
      )
    }
    if (tempDisabled) {
      return <div>{tempDisabled}</div>
    }
    return (
      <>
        <div className={loading ? 'skeleton-wrapper' : ''}>
          {loading ? (
            <Skeleton.Input
              active
              size="default"
              className="loading-skeleton"
            />
          ) : (
            <div className="inner-content">
              {percentageValue != null ? (
                getRoundedPercentageValue()
              ) : percentMode ? (
                <div className="progress-bar">
                  <div
                    className="progress-bar__fill"
                    style={{
                      width: `${percentValue}%`,
                      backgroundColor: isSuccessCheck ? undefined : '#C62828',
                    }}
                  >
                    <span className="progress-bar__label">{percentValue}%</span>
                  </div>
                </div>
              ) : (
                <div className={`sub-footer ${countClassName || ''}`}>
                  {value != null ? displayValue : formatNumber(count || 0)}
                </div>
              )}
              {countText && (
                <div className="card-subtext">
                  {'     '}{countText}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="card-footer-wrapper">
          {button ? (
            button
          ) : (showAction && !isStartingPlan) && actionText && (
            <Button
              type="primary"
              onClick={onActionClick || undefined}
              href={actionHref}
              loading={actionLoading}
              className="footer-button"
            >
              {actionText}
            </Button>
          )}
          {footerText && <span className="card-footer-text">{footerText}</span>}
        </div>
        {(subValue && !loading) && (
          <span className="sub-value">
            {loading ? (
              <Spin  indicator={<LoadingOutlined spin />} className="spinner-small" />
            ) : (
              `${displaySubValue}`
            )}{' '}
            outputs
          </span>
        )}
      </>
    )
  }

  return (
    <Card
      className={`${cardContainerClass} ${className || ''}`}
      title={renderHeader()}
    >
      {description && (
        <Card.Meta
          description={
            <div className={`card-description ${iconTitleMode ? 'card-description--padded' : ''}`}>
              {description}
            </div>
          }
        />
      )}
      {renderContent()}
    </Card>
  )
}
