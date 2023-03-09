import React from 'react'

import styles from '../styles.module.css'

import { Card } from 'design'
import { valueOrDefault, formatDate, patchValueFull } from 'utils/helpers'
import NumericValue from 'components/numeric-value'
import FullTextsProgressChart from 'components/full-texts-progress-chart'
import COLORS from 'utils/colors'
import texts from 'texts/issues'

const HarvestingStatusCard = ({
  errorsCount,
  fullTextCount,
  lastHarvestingDate,
  metadataCount,
  total,
}) => (
  <Card>
    <Card.Title tag="h2">{texts.genInfo.title}</Card.Title>
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
    </div>
    {errorsCount && total && (
      <p className={styles.errorsInfo}>
        Harvested with
        <span className={styles.errorsCount}>
          {' '}
          {patchValueFull('{{errorsCount}}', { errorsCount })}{' '}
        </span>
        issue types affecting {patchValueFull('{{total}}', { total })} records
      </p>
    )}
  </Card>
)

export default HarvestingStatusCard
