import { classNames } from '@oacore/design/lib/utils'
import React from 'react'

import styles from './styles.module.css'
import StatisticsChart from '../statistics-chart'
import { formatDate } from '../../utils/helpers'
import Markdown from '../markdown'

import { overview as textIrusUk } from 'texts/irus-uk/index'

const StatUSRN = ({ counter, className, content, usrnParams }) => {
  const { doiCount, totalDoiCount, statisticsIrus } = usrnParams
  const { description: descriptionIrus } = textIrusUk

  let statCreated = ''
  let statusClass = false
  switch (content.id) {
    case 'repositoryOAIPMH':
      statusClass = true
      break
    case 'doi':
      // statCreated = (doiCount / totalDoiCount) * 100
      statCreated = totalDoiCount
      statCreated = doiCount
      statusClass = true
      break
    case 'statisticIRUS':
      statCreated =
        statisticsIrus != null ? (
          <div>
            <StatisticsChart
              data={statisticsIrus.map(({ date, coreViewCount: count }) => ({
                'name': formatDate(date, { month: 'short' }),
                'Views in CORE': count,
              }))}
              colors={{
                'Your repository': 'var(--gray-800)',
                'Views in CORE': 'var(--primary)',
              }}
            />
            <Markdown className={styles.irusDescription}>
              {descriptionIrus}
            </Markdown>
          </div>
        ) : (
          'Loading...'
        )
      statusClass = true
      break
    default:
      statCreated = ''
  }

  return (
    <div
      key={content.id}
      className={classNames.use(styles.statusWrapper).join(className)}
    >
      <div className={styles.statusRow}>
        <div className={styles.counter}>{counter}</div>
        <div className={styles.title}>{content.title}</div>
        <div className={statusClass ? styles.statusSuccess : styles.statusFail}>
          {statusClass ? 'Yes' : 'No'}
        </div>
      </div>
      <div className={styles.statusRow}>
        <div />
        <div>
          <div className={styles.description}>{content.description}</div>
          <div>{statCreated}</div>
        </div>
        <div />
      </div>
    </div>
  )
}

export default StatUSRN
