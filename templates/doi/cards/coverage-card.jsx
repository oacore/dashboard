import React from 'react'

import styles from '../styles.module.css'

import { Card } from 'design'
import * as texts from 'texts/doi'
import NumericValue, { formatNumber } from 'components/numeric-value'
import Markdown from 'components/markdown'
import EnrichmentChart from 'components/enrichment-chart'
import { valueOrDefault } from 'utils/helpers'

const CoverageCard = ({ dataProviderName, doiCount, enrichmentSize }) => (
  <Card className={styles.overviewCard} tag="section">
    <Card.Title tag="h2">{texts.coverage.title}</Card.Title>
    <div className={styles.overviewCardContent}>
      <div>
        <NumericValue
          value={valueOrDefault(doiCount, 'Loading...')}
          caption={texts.coverage.numberLabel}
        />
        {enrichmentSize > 0 && (
          <Markdown>
            {texts.coverage.body.render({
              count: formatNumber(enrichmentSize),
            })}
          </Markdown>
        )}
      </div>
      <div>
        <EnrichmentChart
          value={doiCount}
          increase={enrichmentSize}
          caption={dataProviderName}
        />
      </div>
    </div>
  </Card>
)

export default CoverageCard
