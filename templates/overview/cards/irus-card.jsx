import React from 'react'

import OverviewCard from './overview-card'
import styles from '../styles.module.css'

import { Card } from 'design'
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
  </div>
)

const IrusCard = ({ statistics }) => (
  <OverviewCard>
    <Card.Title tag="h2">IRUS</Card.Title>
    {statistics != null ? (
      <Content className={styles.irusCardContent} data={statistics} />
    ) : (
      'Loading...'
    )}
  </OverviewCard>
)

export default IrusCard
