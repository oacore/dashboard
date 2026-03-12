import React, { useEffect, useState } from 'react'

import OverviewCard from './overview-card'
import styles from '../styles.module.css'
import texts from '../../../texts/orcid/orcid.yml'
import ExportButton from '../../../components/export-button'

import Legend from 'components/legend'
import PerformanceChart from 'components/performance-chart'
import { formatNumber, getPercent, valueOrDefault } from 'utils/helpers'
import LinkButton from 'components/link-button'
import COLORS from 'utils/colors'

const OrcidCard = ({
  count,
  outputsCount,
  enrichmentSize,
  dataProviderId,
  href,
  billingPlan,
}) => {
  const [checkBillingType, setCheckBillingType] = useState(false)

  useEffect(() => {
    setCheckBillingType(billingPlan?.billingType === 'starting')
  }, [billingPlan])

  const chartValues = [
    {
      name: 'Outputs have at least one ORCID',
      value: valueOrDefault(count, '🔁'),
      color: COLORS.successDark,
    },
    {
      name: 'Discovered ORCID enrichments',
      value: valueOrDefault(enrichmentSize, '🔁'),
      color: COLORS.success,
    },
    {
      name: 'Outputs without ORCID',
      value: valueOrDefault(outputsCount - enrichmentSize - count, null),
      color: COLORS.gray200,
    },
  ]

  return (
    <OverviewCard title={texts.orcidCard.title}>
      <div className={styles.doiCard}>
        <PerformanceChart
          caption={<DiffStatistics outputsCount={outputsCount} count={count} />}
          value={valueOrDefault((count / outputsCount) * 100, '🔁')}
          className={styles.chart}
          values={chartValues}
        />
        <div className={styles.doiCardContent}>
          <div>
            We can enrich your ORCID coverage by{' '}
            <b>{getPercent(enrichmentSize, count, enrichmentSize || '...')}</b>{' '}
            Download your CSV below.
          </div>
          <Legend values={chartValues} />
          <div className={styles.doiCardActions}>
            {!checkBillingType ? (
              <>
                <LinkButton
                  variant="text"
                  href="orcid"
                  dataProviderId={dataProviderId}
                  className={styles.linkButton}
                >
                  {texts.orcidCard.actions[0].title}
                </LinkButton>
                <ExportButton
                  href={href}
                  variant="contained"
                  className={styles.linkButton}
                >
                  {texts.orcidCard.actions[1].title}
                </ExportButton>
              </>
            ) : (
              <LinkButton
                variant="contained"
                href="orcid"
                dataProviderId={dataProviderId}
                className={styles.linkButton}
              >
                details
              </LinkButton>
            )}
          </div>
        </div>
      </div>
    </OverviewCard>
  )
}

const DiffStatistics = ({ outputsCount, count }) =>
  outputsCount ? (
    <span className={styles.statistics}>
      {formatNumber(count, { notation: 'compact' })} out of{' '}
      {formatNumber(outputsCount, { notation: 'compact' })}
    </span>
  ) : (
    <span>Loading...</span>
  )

export default OrcidCard
