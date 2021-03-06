import React from 'react'
import Link from 'next/link'

import styles from '../styles.module.css'
import OverviewCard from './overview-card'

import { Link as DesignLink } from 'design'
import NumericValue from 'components/numeric-value'
import { valueOrDefault, formatDate } from 'utils/helpers'
import LinkButton from 'components/link-button'
import * as texts from 'texts/overview'

const HarvestingStatus = ({
  date,
  errorCount,
  warningCount,
  dataProviderId,
}) => {
  const formattedDate = date != null ? formatDate(date) : null

  const counter =
    errorCount > 0
      ? { number: errorCount, entity: 'error' }
      : { number: warningCount, entity: 'warning' }
  const caption =
    counter.number > 0 ? (
      <>
        harvested with {counter.number}{' '}
        <Link
          href="/data-providers/[data-provider-id]/issues"
          as={`/data-providers/${dataProviderId}/issues`}
          passHref
        >
          <DesignLink>{counter.entity}s</DesignLink>
        </Link>
      </>
    ) : (
      `harvested with no errors`
    )

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
  <OverviewCard {...restProps} title={texts.harvesting.cardTooltip}>
    <h2>{texts.harvesting.title}</h2>
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
      dataProviderId={dataProviderId}
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
