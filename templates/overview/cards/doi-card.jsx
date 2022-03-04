import React from 'react'

import OverviewCard from './overview-card'
import styles from '../styles.module.css'
import ExportButton from '../../../components/export-button'

import Actions from 'components/actions'
import Legend from 'components/legend'
import Markdown from 'components/markdown'
import * as texts from 'texts/overview'
import { Card } from 'design'
import PerformanceChart from 'components/performance-chart'
import { valueOrDefault, formatNumber } from 'utils/helpers'
import LinkButton from 'components/link-button'
import COLORS from 'utils/colors'

const formatPercent = (number, precision = 2) => `${number.toFixed(precision)}%`

const DoiCard = ({
  doiCount,
  outputsCount,
  enrichmentSize,
  dataProviderId,
  downloadUrl,
}) => {
  const { title, description, action, downloadAction } = texts.doi

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
    <OverviewCard title={texts.doi.cardTooltip}>
      <div className={styles.doiCardHeader}>
        <Card.Title tag="h2">{title}</Card.Title>
        <Actions downloadUrl={downloadUrl} />
      </div>
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
                count: formatPercent((enrichmentSize / doiCount) * 100),
              })}
            </Markdown>
          )}

          <Legend values={chartValues} />
          <div className={styles.doiCardActions}>
            <LinkButton
              variant="text"
              href="doi"
              dataProviderId={dataProviderId}
              className={styles.linkButton}
            >
              {action}
            </LinkButton>
            <ExportButton href={downloadUrl} className={styles.linkButton}>
              {downloadAction}
            </ExportButton>
          </div>
        </div>
      </div>
    </OverviewCard>
  )
}

const DiffStatistics = ({ outputsCount, doiCount }) => (
  <span className={styles.statistics}>
    {formatNumber(doiCount, { notation: 'compact' })} out of{' '}
    {formatNumber(outputsCount, { notation: 'compact' })}
  </span>
)

export default DoiCard
