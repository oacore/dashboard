import React from 'react'

import styles from '../styles.module.css'

import { Card } from 'design'
import { valueOrDefault, formatDate } from 'utils/helpers'
import NumericValue from 'components/numeric-value'
import FullTextsProgressChart from 'components/full-texts-progress-chart'
import COLORS from 'utils/colors'

const HarvestingStatusCard = ({
  errorsCount,
  fullTextCount,
  lastHarvestingDate,
  metadataCount,
}) => (
  <Card>
    <Card.Title tag="h2">General information</Card.Title>
    <div className={styles.metadata}>
      <NumericValue
        value={valueOrDefault(formatDate(lastHarvestingDate), 'Loading...')}
        title="Last successful updating"
        tag="div"
        bold
      />
      <NumericValue
        value={valueOrDefault(metadataCount, 'Loading...')}
        title="Total harvested outputs"
        tag="div"
        bold
      />
    </div>
    <FullTextsProgressChart
      className={styles.chart}
      fullTextCount={fullTextCount}
      chartValues={[
        {
          name: 'Full text',
          value: fullTextCount,
          color: COLORS.primary,
        },
        {
          name: 'Without full text',
          value: metadataCount - fullTextCount,
          color: COLORS.gray200,
        },
      ]}
      caption="Full texts"
      value={valueOrDefault((fullTextCount / metadataCount) * 100, '🔁')}
    />
    {errorsCount && (
      <p className={styles.errorsInfo}>
        Harvested with
        <span className={styles.errorsCount}> {errorsCount}</span> errors
      </p>
    )}
  </Card>
)

export default HarvestingStatusCard
