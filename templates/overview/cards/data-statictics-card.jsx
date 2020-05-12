import React from 'react'

import styles from '../styles.module.css'
import OverviewCard from './overview-card'

import NumericValue from 'components/numeric-value'
import { valueOrDefault } from 'utils/helpers'
import LinkButton from 'components/link-button'

const DataStatisticsCard = ({
  metadataCount,
  fullTextCount,
  dataProviderId,
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
    <LinkButton
      href="content"
      dataProviderId={dataProviderId}
      className={styles.linkButton}
    >
      Browse
    </LinkButton>
  </OverviewCard>
)
export default DataStatisticsCard
