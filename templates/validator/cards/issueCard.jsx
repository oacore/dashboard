import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../../harvesting/styles.module.css'
import { Icon } from '../../../design'

const IssueCard = () => (
  <li>
    <div className={styles.typeCardSection}>
      <div className={styles.typeCardHeader}>
        <Icon
          src="#alert"
          // className={classNames.use(`${styles[`cardIcon${type}`]}`)}
        />
        <h3 className={styles.typeCardTitle}>title1</h3>
      </div>
      <p>descript1</p>
      <div
        className={classNames.use(
          styles.typeCardCount
          // `${styles[`typeCardCount${type}`]}`
        )}
      >
        <span>5</span> text
      </div>
    </div>
  </li>
)

export default IssueCard
