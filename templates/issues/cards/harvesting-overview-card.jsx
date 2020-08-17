import React from 'react'

import styles from '../styles.module.css'

import { Card } from 'design'
import NumericValue from 'components/numeric-value'
import { valueOrDefault, formatDate } from 'utils/helpers'
import texts from 'texts/issues'

const HarvestingOverviewCard = ({
  lastHarvestingDate,
  globalsCount,
  isLoadingHarvestingStatus,
}) => {
  let harvesting = {
    date: null,
    caption: null,
  }

  if (!isLoadingHarvestingStatus) {
    if (lastHarvestingDate == null) {
      harvesting = {
        date: 'Unknown',
        caption: '',
      }
    } else {
      harvesting = {
        date: formatDate(lastHarvestingDate),
        caption:
          globalsCount == null
            ? 'aborted due to error'
            : 'harvested successfully',
      }
    }
  }

  return (
    <Card
      className={styles.harvestingOverview}
      tag="section"
      title={texts.harvestingCardTooltip}
    >
      <Card.Title tag="h2">Harvesting status</Card.Title>
      <NumericValue
        value={valueOrDefault(harvesting.date, 'Loading...')}
        caption={globalsCount == null ? 'Loading...' : harvesting.caption}
        tag="p"
      />
    </Card>
  )
}

export default HarvestingOverviewCard
