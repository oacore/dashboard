import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import OverviewCard from './overview-card'
import styles from '../styles.module.css'

import Markdown from 'components/markdown'
import { Button } from 'design'
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

  const mainLabelText = `${formatNumber(complianceLevel * 100, {
    maximumFractionDigits: 2,
  })}%`

  const secondaryLabelText = `${formatNumber(100 - complianceLevel * 100, {
    maximumFractionDigits: 2,
  })}%`

  return (
    <Tag className={classNames.use(styles.row).join(className)} {...htmlProps}>
      <div className={styles.bar} style={{ flexGrow: complianceLevel }}>
        {complianceLevel >= 0.2 && mainLabelText}
      </div>
      <div
        className={classNames.use(styles.bar, styles.empty)}
        style={{ flexGrow: 1 - complianceLevel }}
      >
        {complianceLevel >= 0.1 &&
          complianceLevel <= 0.94 &&
          secondaryLabelText}
      </div>
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
    >
      compliant with RIOXX
    </PercentageChart>
    <ul className={styles.issuesList}>
      {missingTerms.map(({ elementName, outputsCount }) => (
        <li key={elementName}>
          <span>{formatNumber(outputsCount)}</span>
          &nbsp;outputs are missing&nbsp;
          <code>{elementName}</code>
        </li>
      ))}
    </ul>
    <Button
      variant="outlined"
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
  <OverviewCard renderWarning title={texts.rioxx.title}>
    <Markdown className={styles.subtitle}>{texts.rioxx.description}</Markdown>
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
