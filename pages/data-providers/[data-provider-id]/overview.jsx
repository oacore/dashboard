import React from 'react'
import { ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'
import { classNames } from '@oacore/design/lib/utils'

import { withGlobalStore } from 'store'
import { Button, Card, Overlay } from 'design'
import NumericValue from 'components/numeric-value'
import TimeLagChart from 'components/time-lag-chart'
import { depositing } from 'texts/overview'

// TODO: Remove once cards are in @oacore/design
// eslint-disable-next-line
import styles from './overview.css'

const RadialChart = ({ value, caption }) => (
  <div className={styles.chartContainer}>
    <ResponsiveContainer width="100%" height={320 - 64}>
      <RadialBarChart
        innerRadius="95%"
        data={[
          {
            value,
            fill: 'var(--primary)',
          },
          {
            value: 100,
            fill: '#fff',
          },
        ]}
        startAngle={225}
        endAngle={-45}
      >
        <RadialBar minAngle={15} background clockWise dataKey="value" />
      </RadialBarChart>
    </ResponsiveContainer>
    <NumericValue
      className={styles.chartLabel}
      value={value}
      append="%"
      caption={caption}
    />
  </div>
)

const PlaceholderCard = ({ title, value, description }) => (
  <Card>
    <h2>{title}</h2>
    <RadialChart value={value} caption={title} />
    <p>{description}</p>
    <Button variant="contained" disabled>
      Browse
    </Button>
    <Overlay blur>
      <b>Coming soon</b>
    </Overlay>
  </Card>
)

const Loading = ({ children = 'Loading...', tag: Tag = 'p', ...restProps }) => (
  <Tag {...restProps}>{children}</Tag>
)

const valueOrDefault = (value, defaultValue) =>
  value == null ? defaultValue : value

const DataStatisticsCard = ({
  metadataCount,
  fullTextCount,
  className,
  ...restProps
}) => (
  <Card className={className} {...restProps}>
    <h2>Harvested data</h2>
    <NumericValue
      value={valueOrDefault(fullTextCount, 'Loading...')}
      caption="full texts"
    />
    <NumericValue
      value={valueOrDefault(metadataCount, 'Loading...')}
      caption="metadata records"
      size="small"
    />
    <Button variant="contained" href="content" tag="a">
      Browse
    </Button>
  </Card>
)

const DepositingCard = ({ chartData, complianceLevel }) => {
  const { title, description, action } = depositing
  const loading = chartData == null && complianceLevel == null
  const content =
    !loading && chartData && chartData.length > 0 ? (
      <>
        <TimeLagChart data={chartData} height={200} />
        <p>
          {description.complianceLevel.render({
            amount: (100 - complianceLevel).toFixed(1),
          })}
        </p>
        <Button variant="contained" href="deposit-dates" tag="a" disabled>
          {action}
        </Button>
      </>
    ) : (
      <p>{description.missingData}</p>
    )

  return (
    <Card>
      <h2>{title}</h2>
      {loading ? <Loading /> : content}
    </Card>
  )
}

const DashboardView = ({
  metadataCount,
  fullTextCount,
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
    <DepositingCard
      chartData={isTimeLagDataLoading ? null : timeLagData}
      complianceLevel={isTimeLagDataLoading ? null : complianceLevel}
    />

    <PlaceholderCard title="DOIs" value={14.2} />
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
    item =>
      item.depositTimeLag >= leftLimit && item.depositTimeLag <= rightLimit
  )
}

const Dashboard = ({ store, ...restProps }) => (
  <DashboardView
    metadataCount={store.statistics.metadataCount}
    fullTextCount={store.statistics.fullTextCount}
    timeLagData={filterChartData(
      store.depositDates.timeLagData,
      store.depositDates.complianceLevel / 100
    )}
    isTimeLagDataLoading={store.depositDates.isRetrieveDepositDatesInProgress}
    complianceLevel={store.depositDates.complianceLevel}
    {...restProps}
  />
)

export default withGlobalStore(Dashboard)
