import React from 'react'

import OverviewCard from './overview-card'
import styles from '../styles.module.css'

import { Card } from 'design'
import Markdown from 'components/markdown'
import StatisticsChart from 'components/statistics-chart'
import { formatDate } from 'utils/helpers'

const Content = ({ data, ...htmlProps }) => (
  <div {...htmlProps}>
    <StatisticsChart
      data={data.map(({ date, coreViewCount: count }) => ({
        'name': formatDate(date, { month: 'short' }),
        'Views in CORE': count,
      }))}
      colors={{
        'Your repository': 'var(--gray-800)',
        'Views in CORE': 'var(--primary)',
      }}
    />
    <Markdown>
      Statistics collected by [IRUS](https://irus.jisc.ac.uk) from
      [core.ac.uk](https://core.ac.uk)
    </Markdown>
  </div>
)

const IrusCard = ({ statistics }) => (
  <OverviewCard>
    <Card.Title tag="h2">Download statistics</Card.Title>
    {statistics != null ? (
      <Content className={styles.irusCardContent} data={statistics} />
    ) : (
      'Loading...'
    )}
  </OverviewCard>
)

export default IrusCard
