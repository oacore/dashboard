import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import OverviewCard from './overview-card'
import styles from '../styles.module.css'

import Actions from 'components/actions'
import { Card } from 'design'
import Markdown from 'components/markdown'
import StatisticsChart from 'components/statistics-chart'
import { formatDate } from 'utils/helpers'
import * as texts from 'texts/overview'

const { title, cardTooltip, description } = texts.irusUk

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
    <Markdown className={styles.irusDescription}>{description}</Markdown>
  </div>
)

const IrusCard = ({ statistics }) => (
  <OverviewCard title={cardTooltip}>
    <div className={classNames.use(styles.cardHeader, styles.cardHeaderIrus)}>
      <Card.Title tag="h2">{title}</Card.Title>
      <Actions />
    </div>
    {statistics != null ? (
      <Content className={styles.irusCardContent} data={statistics} />
    ) : (
      'Loading...'
    )}
  </OverviewCard>
)

export default IrusCard
