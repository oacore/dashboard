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
  const STATUS_NO = 0
  const STATUS_YES = 1
  const STATUS_DEVELOP = 2
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
    rorId,
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

    const percentStyle =
      percentFull < 15 || isLoading ? `auto` : `${percentFull}%`
    return (
      <div className={styles.chartRow}>
        <div
          className={classNames.use(
            styles.chartBar,
            isLoading ? styles.loadingBar : styles.base
          )}
          style={{ width: percentStyle }}
        >
          <span className={styles.chartPercent}>
            {isLoading ? 'Not available' : `${formatNumber(percentFull)}%`}
          </span>
        </div>
      </div>
    )
  }

  let statCreated = ''
  let statTextCreated = ''
  let statusClass = STATUS_NO
  switch (content.id) {
    case 'accessibilityStatements':
      statusClass = STATUS_DEVELOP
      break
    case 'ORCID':
      statusClass = STATUS_DEVELOP
      break
    case 'sourceCode':
      statusClass = STATUS_DEVELOP
      break
    case 'repositoryOAIPMH':
      statusClass = STATUS_NO
      break
    case 'applicationProfile':
      statusClass =
        rioxxTotalCount && rioxxPartiallyCompliantCount ? STATUS_YES : STATUS_NO
      statCreated =
        statusClass === STATUS_YES
          ? enrichmentChart({
              coveredCount: rioxxPartiallyCompliantCount,
              totalCount: rioxxTotalCount,
            })
          : ''
      break
    case 'accessFullTexts':
      statusClass = countFulltext && countMetadata ? STATUS_YES : STATUS_NO
      statCreated =
        statusClass === STATUS_YES
          ? enrichmentChart({
              coveredCount: countFulltext,
              totalCount: countMetadata,
            })
          : ''
      break
    case 'embargoedDocuments':
      statusClass = embargoedDocuments ? STATUS_YES : STATUS_NO
      statTextCreated =
        statusClass === STATUS_YES ? (
          <NumericValue
            value={valueOrDefault(embargoedDocuments, 'Loading...')}
            size="extra-small"
          />
        ) : (
          ''
        )
      break
    case 'vocabulariesCOAR':
      statusClass =
        usrnVocabulariesCOAR && usrnVocabulariesCOAR > 0
          ? STATUS_YES
          : STATUS_NO

      statCreated = statusClass === STATUS_YES ? usrnVocabulariesCOAR : ''
      break
    case 'webAccessibility':
      statusClass = supportsBetterMetadata ? STATUS_YES : STATUS_NO
      statCreated = ''
      break
    case 'signpostingFAIR':
      statusClass = supportSignposting ? STATUS_YES : STATUS_NO
      statCreated = ''
      break
    case 'licensingMetadata':
      statusClass = usrnLicense ? STATUS_YES : STATUS_NO
      statTextCreated =
        statusClass === STATUS_YES ? (
          <NumericValue
            value={valueOrDefault(usrnLicense, 'Loading...')}
            size="extra-small"
          />
        ) : (
          ''
        )
      break
    case 'ROR':
      statusClass = rorId ? STATUS_YES : STATUS_NO
      break
    case 'doi':
      statusClass = doiCount && totalDoiCount ? STATUS_YES : STATUS_NO
      statCreated =
        statusClass === STATUS_YES
          ? enrichmentChart({
              coveredCount: doiCount,
              totalCount: totalDoiCount,
            })
          : ''
      break
    case 'indexedContent':
      statusClass = countMetadata ? STATUS_YES : STATUS_NO
      statTextCreated =
        statusClass === STATUS_YES ? (
          <NumericValue
            value={valueOrDefault(countMetadata, 'Loading...')}
            size="extra-small"
          />
        ) : (
          ''
        )
      break
    case 'statisticIRUS':
      statusClass = statisticsIrus != null ? STATUS_YES : STATUS_NO
      statCreated =
        statusClass === STATUS_YES ? (
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
          ''
        )
      break
    default:
      statCreated = ''
  }

  const descriptionCreated = content.description ? (
    <Markdown className={styles.description}>{content.description}</Markdown>
  ) : (
    <div className={styles.descriptionEmpty} />
  )
  const prefixCreated =
    content.prefix && statusClass ? (
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
      <Markdown className={styles.recommendationContent}>
        {content.recommendation}
      </Markdown>
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
            // eslint-disable-next-line no-nested-ternary
            statusClass === STATUS_NO
              ? styles.status0
              : statusClass === STATUS_YES
              ? styles.status1
              : styles.status2
          )}
        >
          {
            // eslint-disable-next-line no-nested-ternary
            statusClass === STATUS_NO
              ? 'No'
              : statusClass === STATUS_YES
              ? 'Yes'
              : 'Develop'
          }
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
