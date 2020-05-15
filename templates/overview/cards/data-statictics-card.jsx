import React from 'react'

import styles from '../styles.module.css'
import OverviewCard from './overview-card'

import NumericValue from 'components/numeric-value'
import { valueOrDefault, formatDate } from 'utils/helpers'
import LinkButton from 'components/link-button'

const HarvestingStatus = ({ date, errorCount, warningCount }) => {
  const formattedDate = date != null ? formatDate(date) : null

  const counter =
    errorCount > 0
      ? { number: errorCount, entity: 'error' }
      : { number: warningCount, entity: 'warning' }
  const caption =
    counter.number > 0
      ? `harvested with ${counter.number || 'no'} ${counter.entity}s`
      : `harvested with no errors`

  return (
    <NumericValue
      tag="p"
      value={valueOrDefault(formattedDate, 'Loading...')}
      caption={counter.number == null ? 'Loading...' : caption}
      size="small"
    />
  )
}

const DataStatisticsCard = ({
  metadataCount,
  fullTextCount,
  dataProviderId,
  harvestingDate,
  errorCount,
  warningCount,
  ...restProps
}) => (
  <OverviewCard {...restProps}>
    <h2>Harvested data</h2>
    <NumericValue
      tag="p"
      value={valueOrDefault(fullTextCount, 'Loading...')}
      caption="full texts"
    />
    <NumericValue
      tag="p"
      value={valueOrDefault(metadataCount, 'Loading...')}
      caption="metadata records"
      size="small"
    />
    <HarvestingStatus
      date={harvestingDate}
      errorCount={errorCount}
      warningCount={warningCount}
    />
    <p className={styles.overviewCardFooter}>
      <LinkButton
        className={styles.linkButton}
        href="issues"
        dataProviderId={dataProviderId}
      >
        Issues
      </LinkButton>
      <LinkButton
        className={styles.linkButton}
        variant="text"
        href="content"
        dataProviderId={dataProviderId}
      >
        Content
      </LinkButton>
    </p>
  </OverviewCard>
)
export default DataStatisticsCard
