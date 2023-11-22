import { classNames } from '@oacore/design/lib/utils'
import React from 'react'

import { Card } from '../../design'
import styles from './styles.module.css'
import Markdown from '../../components/markdown'

const AccessUsers = ({
  className,
  title,
  subTitle,
  userNames,
  userEmail,
  subDescription,
  description,
}) => (
  <Card
    className={classNames.use(styles.section).join(className)}
    tag="section"
  >
    <div className={styles.formWrapper}>
      <div className={styles.formInnerWrapper}>
        <Card.Title tag="h2">{title}</Card.Title>
        <Markdown className={styles.info}>{subTitle}</Markdown>
        <div className={styles.userMainWrapper}>
          <div className={styles.userWrapper}>
            <div className={styles.user}>
              <div className={styles.userName}>{userNames}</div>
              <div className={styles.userName}>{userEmail}</div>
            </div>
            <p className={styles.subTitle}>{subDescription}</p>
            <div className={styles.additionalInfo}>{description}</div>
          </div>
          <div className={styles.userWrapper}>
            <div className={styles.user}>
              <div className={styles.userName}>{userNames}</div>
              <div className={styles.userName}>{userEmail}</div>
            </div>
            <p className={styles.subTitle}>{subDescription}</p>
            <div className={styles.additionalInfo}>{description}</div>
          </div>
        </div>
      </div>
      <div className={styles.mainWarningWrapper} />
    </div>
  </Card>
)

export default AccessUsers
