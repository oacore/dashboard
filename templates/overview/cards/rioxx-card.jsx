import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import OverviewCard from './overview-card'
import styles from '../styles.module.css'

import { Button, Card } from 'design'
import * as texts from 'texts/overview'
import { formatNumber } from 'utils/helpers'

const RIOXX_SPEC_URL = 'https://www.rioxx.net/profiles/v2-0-rc-2/'

const PercentageChart = ({
  compliantCount,
  totalCount,
  children,
  className,
  tag: Tag = 'div',
  ...htmlProps
}) => {
  const complianceLevel = compliantCount / totalCount
  const labelText = `${formatNumber(complianceLevel * 100, {
    maximumFractionDigits: 2,
  })}%`

  return (
    <Tag className={classNames.use(styles.row).join(className)} {...htmlProps}>
      <div
        className={styles.bar}
        style={{ width: `${complianceLevel * 100}%` }}
      />
      <span
        className={classNames.use(
          styles.label,
          complianceLevel >= 0.2 && styles.left
        )}
      >
        {labelText}
      </span>
      <span className="sr-only">{children}</span>
    </Tag>
  )
}

const Content = ({ compliantCount, totalCount, missingTerms }) => (
  <>
    <PercentageChart
      compliantCount={compliantCount}
      totalCount={totalCount}
      className={styles.rioxxChart}
      title={`${formatNumber(compliantCount)} out of ${formatNumber(
        totalCount
      )} outputs are compliant with basic RIOXX`}
      tag="p"
    >
      compliant with RIOXX
    </PercentageChart>
    <ul className={styles.issuesList}>
      {missingTerms.map(({ elementName, outputsCount }) => (
        <li>
          <span className={styles.count}>{formatNumber(outputsCount)}</span>
          &nbsp;outputs are missing&nbsp;
          <code>{elementName}</code>
        </li>
      ))}
    </ul>
    <Button
      variant="contained"
      className={styles.linkButton}
      href={RIOXX_SPEC_URL}
      target="_blank"
      rel="noopener noreferrer"
      tag="a"
    >
      Learn more
    </Button>
  </>
)

const RioxxCard = ({ compliance }) => (
  <OverviewCard>
    <Card.Title tag="h2">{texts.rioxx.title}</Card.Title>
    {compliance != null ? (
      <Content
        compliantCount={compliance.partiallyCompliantCount}
        totalCount={compliance.totalCount}
        missingTerms={compliance.missingTermsBasic}
      />
    ) : (
      'Loading...'
    )}
  </OverviewCard>
)

export default RioxxCard
