import React from 'react'
import { ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'
import { classNames } from '@oacore/design/lib/utils'

import { withGlobalStore } from 'store'
import { Button, Card, Overlay, Numeral } from 'design'
import TimeLagChart from 'components/time-lag-chart'
import { depositing } from 'texts/overview'

// TODO: Remove once cards are in @oacore/design
// eslint-disable-next-line
import styles from './overview.css'

const formatNumber = (n, { locale = 'en-GB' } = {}) =>
  n > 1000
    ? `${(Math.floor(n / 10) / 100).toLocaleString(locale)}\xa0K`
    : n.toLocaleString(locale)

const Num = ({ value, append, caption, diff, ...restProps }) => (
  <Numeral tag="p" {...restProps}>
    <Numeral.Value>{formatNumber(value)}</Numeral.Value>
    {append && <Numeral.Appendix>&nbsp;{append}</Numeral.Appendix>}{' '}
    {diff && <Numeral.Diff>{diff}</Numeral.Diff>}{' '}
    <Numeral.Caption>{caption}</Numeral.Caption>
  </Numeral>
)

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
    <Num
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
    <Overlay>
      <b>Coming soon</b>
    </Overlay>
  </Card>
)

const DataStatisticsCard = ({
  metadataCount,
  fullTextCount,
  className,
  ...restProps
}) => (
  <Card className={classNames.use(styles.dataCard, className)} {...restProps}>
    <h2>Content at glance</h2>
    <Num value={fullTextCount} caption="full texts" />
    <Num value={metadataCount} caption="meta-data records" size="small" />
    <Button variant="contained" href="content" tag="a">
      Browse
    </Button>
  </Card>
)

const DepositingCard = ({ chartData, complianceLevel }) => {
  const { title, description, action } = depositing
  return (
    <Card>
      <h2>{title}</h2>
      <TimeLagChart data={chartData} height={200} />
      {description && (
        <p>
          {description.render({
            amount: `${(100 - complianceLevel).toFixed(2)}%`,
          })}
        </p>
      )}
      <Button variant="contained" href="deposit-dates" tag="a">
        {action}
      </Button>
    </Card>
  )
}

const DashboardView = ({
  metadataCount,
  fullTextCount,
  timeLagData,
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

    <PlaceholderCard title="DOIs" value={14.2} />
    <PlaceholderCard title="ORCiDs" value={5.8} />
  </main>
)

const Dashboard = ({ store, ...restProps }) => (
  <DashboardView
    metadataCount={store.statistics.metadataCount}
    fullTextCount={store.statistics.fullTextCount}
    timeLagData={store.depositDates.timeLagData.filter(
      item => item.depositTimeLag >= -45 && item.depositTimeLag <= 135
    )}
    complianceLevel={store.depositDates.complianceLevel}
    {...restProps}
  />
)

export default withGlobalStore(Dashboard)
