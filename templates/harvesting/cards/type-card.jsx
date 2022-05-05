import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'
import useIssues from '../hooks/use-issues'
import IssuesList from './issues-list'

import { Button, Icon } from 'design'
import texts from 'texts/issues'

const TypeCard = ({ type, count, title, trigger, resolution, issuesList }) => {
  const [visibleList, setVisibleList] = useState(false)
  const {
    data: issues,
    loadMore: loadMoreIssues,
    loading: issuesLoading,

    onCleanList,
  } = useIssues({ pages: issuesList })
  const toggleVisibleList = () => {
    onCleanList()
    setVisibleList(!visibleList)
    if (!visibleList) loadMoreIssues()
  }

  return (
    <li className={styles.typeCard}>
      <div className={styles.typeCardSection}>
        <div className={styles.typeCardHeader}>
          <Icon
            src="#alert"
            className={classNames.use(`${styles[`cardIcon${type}`]}`)}
          />
          <h3 className={styles.typeCardTitle}>{title}</h3>
        </div>
        <p>{trigger}</p>
        <div
          className={classNames.use(
            styles.typeCardCount,
            `${styles[`typeCardCount${type}`]}`
          )}
        >
          <span>{count}</span> {texts.issues.affected}
        </div>
      </div>

      <div className={styles.typeCardSection}>
        <div className={styles.typeCardHeader}>
          <Icon src="#comment-multiple" className={styles.cardIconComment} />
          <h3 className={styles.typeCardTitle}>
            {texts.issues.recommendationCardTitle}
          </h3>
        </div>
        <p>{resolution}</p>
        <div className={styles.typeCardActions}>
          <Button variant="contained">{texts.issues.downloadAction} </Button>
          <Button
            variant="outlined"
            disabled={issuesLoading}
            onClick={toggleVisibleList}
          >
            {visibleList
              ? texts.issues.listActions.hide
              : texts.issues.listActions.show}
          </Button>
        </div>
      </div>
      {visibleList && <IssuesList issues={issues} visible={visibleList} />}
    </li>
  )
}

export default TypeCard
