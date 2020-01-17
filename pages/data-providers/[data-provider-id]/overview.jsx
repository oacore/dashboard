import React from 'react'
import { ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'
import { classNames } from '@oacore/design/lib/utils'

import { Button, Card, Overlay, Numeral } from 'design'

// TODO: Remove once cards are in @oacore/design
// eslint-disable-next-line
import styles from './overview.css'

const Num = ({ value, append, caption, diff, ...restProps }) => (
  <Numeral tag="p" {...restProps}>
    <Numeral.Value>{value}</Numeral.Value>
    {append && <Numeral.Appendix>&nbsp;{append}</Numeral.Appendix>}{' '}
    {diff && <Numeral.Diff>{diff}</Numeral.Diff>}{' '}
    <Numeral.Caption>{caption}</Numeral.Caption>
  </Numeral>
)

const dataProviderStatistics = {
  metaDataCount: 5714,
  fullTextCount: 2114,
  depositCompliance: 18.4,
}

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
  metaDataCount,
  fullTextCount,
  className,
  ...restProps
}) => (
  <Card className={classNames.use(styles.dataCard, className)} {...restProps}>
    <h2>Content at glance</h2>
    <Num value={fullTextCount} caption="full texts" />
    <Num value={metaDataCount} caption="meta-data records" size="small" />
    <Button variant="contained" href="content" tag="a">
      Browse
    </Button>
  </Card>
)

const DepositingCard = ({ title = 'Depositing', description, value }) => (
  <Card>
    <h2>{title}</h2>
    <RadialChart value={value} caption="papers" />
    <p>{description}</p>
    <Button variant="contained" href="deposit-dates" tag="a">
      Browse
    </Button>
  </Card>
)

const DashboardView = ({
  metaDataCount,
  fullTextCount,
  depositCompliance,
  className,
  ...restProps
}) => (
  <main
    className={classNames.use(styles.container).join(className)}
    {...restProps}
  >
    <h1 className="sr-only">Overview</h1>

    <DataStatisticsCard
      metaDataCount={metaDataCount}
      fullTextCount={fullTextCount}
    />
    <DepositingCard value={depositCompliance} />

    <PlaceholderCard title="DOIs" value={14.2} />
    <PlaceholderCard title="ORCiDs" value={5.8} />
  </main>
)

const Dashboard = ({ ...restProps }) => (
  <DashboardView
    metaDataCount={dataProviderStatistics.metaDataCount}
    fullTextCount={dataProviderStatistics.fullTextCount}
    depositCompliance={dataProviderStatistics.depositCompliance}
    {...restProps}
  />
)

export default Dashboard
