import React from 'react'
import { classNames } from '@oacore/design/lib/utils'
import Link from 'next/link'

import styles from './overview.module.css'

import { valueOrDefault } from 'utils/helpers'
import { withGlobalStore } from 'store'
import { Button, Card, Overlay } from 'design'
import NumericValue from 'components/numeric-value'
import TimeLagChart from 'components/time-lag-chart'
import * as texts from 'texts/overview'
import PerformanceChart from 'components/performance-chart'

const OverviewCard = ({ children, className, ...passProps }) => (
  <Card className={styles.overviewCard} {...passProps}>
    {children}
  </Card>
)

const LinkButton = withGlobalStore(
  ({
    children,
    store,
    tag = 'a',
    href = '',
    variant = 'contained',
    ...passProps
  }) => (
    <Link
      href={`/data-providers/[data-provider-id]/${href}`}
      as={`/data-providers/${store.dataProvider.id}/${href}`}
      passHref
    >
      <Button
        className={styles.linkButton}
        variant={variant}
        tag={tag}
        {...passProps}
      >
        {children}
      </Button>
    </Link>
  )
)

const PlaceholderCard = ({ title, value, description }) => (
  <OverviewCard>
    <h2>{title}</h2>
    <PerformanceChart className={styles.chart} value={value} caption={title} />
    <p>{description}</p>
    <LinkButton>Browse</LinkButton>
    <Overlay blur>
      <b>Coming soon</b>
    </Overlay>
  </OverviewCard>
)

const Loading = ({ children = 'Loading...', tag: Tag = 'p', ...restProps }) => (
  <Tag {...restProps}>{children}</Tag>
)

const DataStatisticsCard = ({ metadataCount, fullTextCount, ...restProps }) => (
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
    <LinkButton href="content">Browse</LinkButton>
  </OverviewCard>
)

const DepositingCard = ({ chartData, complianceLevel }) => {
  const { title, description, action } = texts.depositing
  const loading = chartData == null && complianceLevel == null
  const content =
    chartData && chartData.length > 0 ? (
      <>
        <TimeLagChart className={styles.chart} data={chartData} height={200} />
        <p>
          {description.complianceLevel.render({
            amount: valueOrDefault(
              complianceLevel && (100 - complianceLevel).toFixed(2),
              'loading...'
            ),
          })}
        </p>
        <LinkButton href="deposit-compliance" tag="a">
          {action}
        </LinkButton>
      </>
    ) : (
      <p>{description.missingData}</p>
    )

  return (
    <OverviewCard>
      <h2>{title}</h2>
      {loading ? <Loading /> : content}
    </OverviewCard>
  )
}

const formatPercent = (number, precision = 2) => `${number.toFixed(precision)}%`

const useDefault = (value, substitute = null) =>
  value == null ||
  value === Infinity ||
  value === -Infinity ||
  Number.isNaN(value)
    ? substitute
    : value

const DOICard = ({ doiCount, outputsCount, enrichmentSize }) => {
  const { title, description, action } = texts.doi
  return (
    <OverviewCard>
      <h2>{title}</h2>
      <PerformanceChart
        className={styles.chart}
        value={useDefault((doiCount / outputsCount) * 100, '🔁')}
        increase={useDefault((enrichmentSize / doiCount) * 100)}
      />
      {enrichmentSize > 0 && (
        <p>
          {description.render({
            count: formatPercent((enrichmentSize / doiCount) * 100),
          })}
        </p>
      )}
      <LinkButton href="doi">{action}</LinkButton>
    </OverviewCard>
  )
}

const DashboardView = ({
  metadataCount,
  fullTextCount,
  doiCount,
  doiEnrichmentSize,
  timeLagData,
  isTimeLagDataLoading,
  complianceLevel,
  className,
  ...restProps
}) => (
  <main
    className={classNames.use(styles.container).join(className)}
    {...restProps}
  >
    <h1 className="sr-only">Overview</h1>
    <DataStatisticsCard
      metadataCount={metadataCount}
      fullTextCount={fullTextCount}
    />
    <DepositingCard chartData={timeLagData} complianceLevel={complianceLevel} />
    <DOICard
      outputsCount={metadataCount}
      doiCount={doiCount}
      enrichmentSize={doiEnrichmentSize}
    />
    <PlaceholderCard title="ORCiDs" value={5.8} />
  </main>
)

const filterChartData = (data, complianceLevel = 0.75) => {
  const dataLimit = 365 * 4
  const complianceLimit = 90

  const leftLimit =
    complianceLimit + Math.floor(dataLimit * complianceLevel) * -1
  const rightLimit = leftLimit + dataLimit

  return data.filter(
    (item) =>
      item.depositTimeLag >= leftLimit && item.depositTimeLag <= rightLimit
  )
}

const Dashboard = ({ store, ...restProps }) => (
  <DashboardView
    metadataCount={store.statistics.metadataCount}
    fullTextCount={store.statistics.fullTextCount}
    timeLagData={
      store.depositDates.timeLagData &&
      store.depositDates.complianceLevel &&
      filterChartData(
        store.depositDates.timeLagData,
        store.depositDates.complianceLevel / 100
      )
    }
    isTimeLagDataLoading={store.depositDates.isRetrieveDepositDatesInProgress}
    complianceLevel={store.depositDates.complianceLevel}
    doiCount={store.doi.originCount}
    doiEnrichmentSize={store.doi.enrichmentSize}
    {...restProps}
  />
)

export default withGlobalStore(Dashboard)
