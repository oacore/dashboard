import { classNames } from '@oacore/design/lib/utils'
import React from 'react'

import styles from './styles.module.css'
import StatisticsChart from '../statistics-chart'
import { formatDate, formatNumber, valueOrDefault } from '../../utils/helpers'
import Markdown from '../markdown'
import NumericValue from '../numeric-value'
import infoLight from '../upload/assets/infoLight.svg'
import LinkDoc from '../usrn-text/linkDoc'

import { overview as textIrusUk } from 'texts/irus-uk/index'

const StatUSRN = ({ className, content, usrnParams }) => {
  const {
    doiCount,
    totalDoiCount,
    statisticsIrus,
    countMetadata,
    rioxxTotalCount,
    rioxxPartiallyCompliantCount,
    countFulltext,
    embargoedDocuments,
    usrnLicense,
    usrnVocabulariesCOAR,
    supportsBetterMetadata,
    supportSignposting,
  } = usrnParams
  const { description: descriptionIrus } = textIrusUk

  const enrichmentChart = ({ coveredCount, totalCount }) => {
    let isLoading = true
    if (
      valueOrDefault(coveredCount, 0) !== 0 &&
      valueOrDefault(totalCount, 0) !== 0
    )
      isLoading = false

    const percent = (coveredCount / totalCount) * 100
    const percentFull = formatNumber(percent, {
      maximumFractionDigits: 1,
    })

    const percentWidth = percentFull < 15 ? '' : `width: ${percentFull}%`
    return (
      <div className={styles.chartRow}>
        <div
          className={classNames.use(
            styles.chartBar,
            isLoading ? styles.loadingBar : styles.base
          )}
          style={{ percentWidth }}
        >
          <span className={styles.chartPercent}>
            {isLoading ? 'Loading...' : `${formatNumber(percentFull)}%`}
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
      // Just text layout
      statusClass = true
      break
    case 'applicationProfile':
      // Not working endpoint
      statCreated = enrichmentChart({
        coveredCount: rioxxPartiallyCompliantCount,
        totalCount: rioxxTotalCount,
      })
      statusClass = true
      break
    case 'accessFullTexts':
      statCreated = enrichmentChart({
        coveredCount: countFulltext,
        totalCount: countMetadata,
      })
      statusClass = true
      break
    case 'embargoedDocuments':
      statCreated = enrichmentChart({
        coveredCount: embargoedDocuments,
        totalCount: 12000 + embargoedDocuments,
      })
      statusClass = true
      break
    case 'vocabulariesCOAR':
      statCreated = usrnVocabulariesCOAR
      statusClass = true
      break
    case 'webAccessibility':
      statCreated = ''
      statusClass = supportsBetterMetadata
      break
    case 'signpostingFAIR':
      statCreated = ''
      statusClass = supportSignposting
      break
    case 'licensingMetadata':
      // eslint-disable-next-line no-case-declarations
      const randomTotalLicense = parseInt(usrnLicense, 10) + usrnLicense / 3 + 5
      statCreated = enrichmentChart({
        coveredCount: usrnLicense,
        totalCount: randomTotalLicense,
      })

      statusClass = true
      break
    case 'ROR':
      // number yes/no
      statTextCreated = (
        <NumericValue
          value={valueOrDefault(null, 'Loading...')}
          size="extra-small"
        />
      )
      statusClass = true
      break
    case 'doi':
      statCreated = enrichmentChart({
        coveredCount: doiCount,
        totalCount: totalDoiCount,
      })
      statusClass = true
      break
    case 'indexedContent':
      statTextCreated = (
        <NumericValue
          value={valueOrDefault(countMetadata, 'Loading...')}
          size="extra-small"
        />
      )
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

  const descriptionCreated = content.description ? (
    <div className={styles.description}>{content.description}</div>
  ) : (
    <div className={styles.descriptionEmpty} />
  )
  const prefixCreated = content.prefix ? (
    <div className={styles.prefix}>{content.prefix}</div>
  ) : (
    ''
  )

  const linkDocumentation = content.linkDocumentation ? (
    <LinkDoc content={content} />
  ) : (
    ''
  )

  const recommendationCreated = content.recommendation ? (
    <div className={styles.recommendationWrapper}>
      <div className={styles.recommendationHeader}>
        <img src={infoLight} alt="info" />
        <span className={styles.text}>Recommendation</span>
      </div>
      <div className={styles.recommendationContent}>
        {content.recommendation}
      </div>
    </div>
  ) : (
    ''
  )

  return (
    <div
      key={content.id}
      className={classNames.use(styles.statusWrapper).join(className)}
    >
      <div className={styles.statusRow}>
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
        <div>
          {descriptionCreated}
          {prefixCreated}
          {linkDocumentation}
          <div className={styles.stat}>{statCreated}</div>
          <div className={styles.statText}>{statTextCreated}</div>
          {recommendationCreated}
        </div>
        <div />
      </div>
    </div>
  )
}

export default StatUSRN
