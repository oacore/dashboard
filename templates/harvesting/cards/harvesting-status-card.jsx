import React from 'react'

import styles from '../styles.module.css'
import info from '../../../components/upload/assets/info.svg'

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
  harvestingError,
}) => (
  <Card className={styles.harvestingCardWrapper}>
    <Card.Title tag="h2">{texts.genInfo.title}</Card.Title>
    <div className={styles.metadata}>
      <div className={styles.metadataItems}>
        <NumericValue
          value={
            harvestingError ? (
              <div className={styles.errorsWrapper}>
                <img className={styles.infoIcon} src={info} alt="riox" />
                <p className={styles.errorText}>
                  This data is not available now.{' '}
                </p>
              </div>
            ) : (
              valueOrDefault(formatDate(lastHarvestingDate), 'Loading...')
            )
          }
          title="Last successful updating"
          tag="div"
          bold
          className={styles.metadataItem}
        />
        {errorsCount && total && (
          <div className={styles.errorWrapper}>
            <p className={styles.errorsInfo}>
              indexed with
              <span className={styles.errorsCount}>
                {' '}
                {patchValueFull('{{errorsCount}}', { errorsCount })}{' '}
              </span>
              issue types affecting {patchValueFull('{{total}}', { total })}{' '}
              records
            </p>
          </div>
        )}
      </div>
      <div className={styles.metadataItems}>
        <NumericValue
          value={valueOrDefault(metadataCount, 'Loading...')}
          title="Total harvested outputs"
          tag="div"
          bold
          className={styles.metadataItem}
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
    </div>
  </Card>
)

export default HarvestingStatusCard
