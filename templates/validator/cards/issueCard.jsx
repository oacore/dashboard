import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'
import { Icon } from '../../../design'

const IssueCard = ({
  validationList,
  issueCount,
  filteredWarning,
  filteredIssue,
  filterRepositoryIssueData,
}) => (
  <ul>
    {validationList &&
      validationList?.map(
        ({
          title,
          description,
          resolution,
          severity,
          key,
          outputsCount,
          elementName,
        }) => (
          <li key={key} className={styles.validationListItem}>
            <div className={styles.validationCardSection}>
              <div className={styles.typeCardHeader}>
                <Icon
                  src="#alert"
                  className={classNames.use({
                    [styles.cardIconWarning]: filteredWarning,
                    [styles.cardIconError]:
                      filteredIssue || filterRepositoryIssueData,
                  })}
                />
                <h3 className={styles.typeCardTitle}>
                  {title || elementName || key}
                </h3>
              </div>
              <p>{description || `Missing element ${elementName || key}`}</p>
              {issueCount && (
                <div className={styles.countWrapper}>
                  <div
                    className={classNames.use(styles.count, {
                      [styles.cardWarning]: severity === 'WARNING',
                      [styles.cardError]: filterRepositoryIssueData,
                    })}
                  >
                    {outputsCount.toLocaleString()}
                  </div>
                  <div
                    className={classNames.use(styles.warningDescription, {
                      [styles.cardWarningBackground]: severity === 'WARNING',
                      [styles.cardErrorBackground]: filterRepositoryIssueData,
                    })}
                  >
                    records are affected by this issue.
                  </div>
                </div>
              )}
              <div className={styles.cardWrapper}>
                <div className={styles.typeCardHeader}>
                  <Icon
                    src="#comment-multiple"
                    className={styles.cardIconComment}
                  />
                  <h3 className={styles.typeCardTitle}>Recommendation</h3>
                </div>
                <span>{resolution || `No recommendations yet`}</span>
              </div>
            </div>
          </li>
        )
      )}
  </ul>
)

export default IssueCard
