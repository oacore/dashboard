import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../../harvesting/styles.module.css'
import { Icon } from '../../../design'

const IssueCard = ({ validationList }) => (
  <ul>
    {validationList &&
      validationList.map(
        ({
          title,
          description,
          resolution,
          severity,
          key,
          recommendationCardTitle,
        }) => (
          <li key={key} className={styles.validationListItem}>
            <div className={styles.validationCardSection}>
              <div className={styles.typeCardHeader}>
                <Icon
                  src="#alert"
                  className={classNames.use({
                    [styles.cardIconWarning]: severity === 'WARNING',
                    [styles.cardIconError]: severity === 'ERROR',
                  })}
                />
                <h3 className={styles.typeCardTitle}>{title}</h3>
              </div>
              <p>{description}</p>
              <div className={styles.cardWrapper}>
                <div className={styles.typeCardHeader}>
                  <Icon
                    src="#comment-multiple"
                    className={styles.cardIconComment}
                  />
                  <h3 className={styles.typeCardTitle}>
                    {recommendationCardTitle}
                  </h3>
                </div>
                <span>{resolution}</span>
              </div>
            </div>
          </li>
        )
      )}
  </ul>
)

export default IssueCard
