import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'

import { Card } from 'design'
import Markdown from 'components/markdown'
import NumericValue from 'components/numeric-value'
import * as texts from 'texts/doi'
import { valueOrDefault, formatNumber } from 'utils/helpers'

const formatBarSize = (n) => n.toFixed(4)

const CoverageEnrichmentChart = ({
  coveredCount,
  totalCount,
  enrichmentSize,
}) => {
  const missingCount = totalCount - (coveredCount + enrichmentSize)

  const coveredPercent = coveredCount / totalCount
  const enrichmentPercent = enrichmentSize / totalCount
  const missingPercent = missingCount / totalCount

  const baseTitle = `${formatNumber(coveredCount)} (${formatNumber(
    coveredPercent * 100
  )}%) outputs have a DOI`
  const enrichmentTitle = `${formatNumber(enrichmentSize)} DOI${
    enrichmentSize > 1 ? 's' : ''
  } can be added from CORE`

  return (
    <div className={styles.chartRow}>
      <div
        className={classNames.use(styles.chartBar, styles.base)}
        style={{ flexGrow: formatBarSize(coveredPercent) }}
        title={baseTitle}
      />
      {enrichmentSize > 0 && (
        <div
          title={enrichmentTitle}
          className={classNames.use(styles.chartBar, styles.extra)}
          style={{ flexGrow: formatBarSize(enrichmentPercent) }}
        />
      )}
      {missingCount > 0 && (
        <div
          className={styles.chartBar}
          style={{ flexGrow: formatBarSize(missingPercent) }}
        />
      )}
    </div>
  )
}

const CoverageCard = ({ doiCount, totalCount, enrichmentSize }) => (
  <Card className={styles.overviewCard} tag="section">
    <Card.Title tag="h2">{texts.coverage.title}</Card.Title>
    <div className={styles.overviewCardContent}>
      <div>
        <NumericValue
          value={valueOrDefault(doiCount, 'Loading...')}
          caption={texts.coverage.numberLabel}
          tag="p"
        />
      </div>
      <div className={styles.optional}>
        <NumericValue
          value={valueOrDefault((doiCount / totalCount) * 100, 'Loading...')}
          append="%"
          caption={texts.coverage.percentLabel}
          tag="p"
        />
      </div>
      <div>
        <NumericValue
          value={valueOrDefault(enrichmentSize, 'Loading...')}
          caption={texts.coverage.enrichmentLabel}
          notation="standard"
          className={classNames.use(enrichmentSize > 0 && styles.enrichment)}
          tag="p"
        />
      </div>
    </div>
    <CoverageEnrichmentChart
      coveredCount={doiCount}
      totalCount={totalCount}
      enrichmentSize={enrichmentSize}
    />
    {enrichmentSize > 0 && (
      <Markdown>
        {texts.coverage.body.render({ count: enrichmentSize })}
      </Markdown>
    )}
  </Card>
)

export default CoverageCard
