import React from 'react'

import OverviewCard from './overview-card'
import styles from '../styles.module.css'

import * as texts from 'texts/overview'
import { Card } from 'design'
import PerformanceChart from 'components/performance-chart'
import { valueOrDefault } from 'utils/helpers'
import LinkButton from 'components/link-button'

const formatPercent = (number, precision = 2) => `${number.toFixed(precision)}%`

const DoiCard = ({
  doiCount,
  outputsCount,
  enrichmentSize,
  dataProviderId,
}) => {
  const { title, description, action } = texts.doi
  return (
    <OverviewCard title={texts.doi.cardTooltip}>
      <Card.Title tag="h2">{title}</Card.Title>
      <PerformanceChart
        className={styles.chart}
        value={valueOrDefault((doiCount / outputsCount) * 100, '🔁')}
        increase={valueOrDefault((enrichmentSize / doiCount) * 100, null)}
      />
      {enrichmentSize > 0 && (
        <p>
          {description.render({
            count: formatPercent((enrichmentSize / doiCount) * 100),
          })}
        </p>
      )}
      <LinkButton
        href="doi"
        dataProviderId={dataProviderId}
        className={styles.linkButton}
      >
        {action}
      </LinkButton>
    </OverviewCard>
  )
}

export default DoiCard
