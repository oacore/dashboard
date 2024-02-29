import React from 'react'

import OverviewCard from './overview-card'
import styles from '../styles.module.css'

import Legend from 'components/legend'
import Markdown from 'components/markdown'
import * as texts from 'texts/overview'
import PerformanceChart from 'components/performance-chart'
import { formatNumber, valueOrDefault, getPercent } from 'utils/helpers'
import LinkButton from 'components/link-button'
import COLORS from 'utils/colors'

const DoiCard = ({
  doiCount,
  outputsCount,
  enrichmentSize,
  dataProviderId,
}) => {
  const { title, description, action, cardTooltip } = texts.doi
  const chartValues = [
    {
      name: 'Outputs have DOI',
      value: valueOrDefault(doiCount, '🔁'),
      color: COLORS.primary,
    },
    {
      name: 'DOIs can be added by CORE',
      value: valueOrDefault(enrichmentSize, '🔁'),
      color: COLORS.primaryLight,
    },
    {
      name: 'Outputs without DOI',
      value: valueOrDefault(outputsCount - enrichmentSize - doiCount, null),
      color: COLORS.gray200,
    },
  ]
  return (
    <OverviewCard title={title} tooltip={cardTooltip}>
      <div className={styles.doiCard}>
        <PerformanceChart
          caption={
            <DiffStatistics outputsCount={outputsCount} doiCount={doiCount} />
          }
          value={valueOrDefault((doiCount / outputsCount) * 100, '🔁')}
          className={styles.chart}
          values={chartValues}
        />
        <div className={styles.doiCardContent}>
          {enrichmentSize > 0 && (
            <Markdown>
              {description.render({
                count: getPercent(
                  enrichmentSize,
                  doiCount,
                  enrichmentSize || '...'
                ),
              })}
            </Markdown>
          )}

          <Legend values={chartValues} />
          <div className={styles.doiCardActions}>
            <LinkButton
              variant="contained"
              href="doi"
              dataProviderId={dataProviderId}
              className={styles.linkButton}
            >
              {action}
            </LinkButton>
          </div>
        </div>
      </div>
    </OverviewCard>
  )
}

const DiffStatistics = ({ outputsCount, doiCount }) =>
  outputsCount ? (
    <span className={styles.statistics}>
      {formatNumber(doiCount, { notation: 'compact' })} out of{' '}
      {formatNumber(outputsCount, { notation: 'compact' })}
    </span>
  ) : (
    <span>Loading...</span>
  )

export default DoiCard
