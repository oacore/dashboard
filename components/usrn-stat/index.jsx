import { classNames } from '@oacore/design/lib/utils'
import React from 'react'

import styles from './styles.module.css'
import StatisticsChart from '../statistics-chart'
import { formatDate, formatNumber, valueOrDefault } from '../../utils/helpers'
import Markdown from '../markdown'

import { overview as textIrusUk } from 'texts/irus-uk/index'

const StatUSRN = ({ counter, className, content, usrnParams }) => {
  const { doiCount, totalDoiCount, statisticsIrus, countMetadata } = usrnParams
  const { description: descriptionIrus } = textIrusUk

  const enrichmentChart = ({ coveredCount, totalCount }) => {
    let isLoading = true
    if (
      valueOrDefault(coveredCount, 0) !== 0 &&
      valueOrDefault(totalCount, 0) !== 0
    )
      isLoading = false

    return (
      <div className={styles.chartRow}>
        <div
          className={classNames.use(
            styles.chartBar,
            isLoading ? styles.loadingBar : styles.base
          )}
        >
          <span className={styles.chartPercent}>
            {isLoading
              ? 'Loading...'
              : `${formatNumber((coveredCount / totalCount) * 100)}%`}
          </span>
        </div>
      </div>
    )
  }

  let statCreated = ''
  let statTextCreated = ''
  let statusClass = false
  switch (content.id) {
    case 'repositoryOAIPMH':
      statusClass = true
      break
    case 'applicationProfile':
    case 'doi':
      statCreated = enrichmentChart({
        coveredCount: doiCount,
        totalCount: totalDoiCount,
      })
      statusClass = true
      break
    case 'indexedContent':
      statTextCreated = valueOrDefault(countMetadata, 'Loading...')
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
        <div
          className={classNames.use(
            styles.status,
            statusClass ? styles.statusSuccess : styles.statusFail
          )}
        >
          {statusClass ? 'Yes' : 'No'}
        </div>
      </div>
      <div className={styles.statusRow}>
        <div />
        <div>
          <div className={styles.description}>{content.description}</div>
          <div className={styles.prefix}>{content.prefix}</div>
          <div className={styles.stat}>{statCreated}</div>
          {statTextCreated.length > 0 ? (
            <div className={styles.statText}>{statTextCreated}</div>
          ) : (
            ''
          )}
        </div>
        <div />
      </div>
    </div>
  )
}

export default StatUSRN
