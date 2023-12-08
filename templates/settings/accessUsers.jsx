import { classNames } from '@oacore/design/lib/utils'
import React from 'react'

import { Card } from '../../design'
import styles from './styles.module.css'

const AccessUsers = ({
  className,
  title,
  subTitle,
  subDescription,
  userData,
}) => (
  <Card
    className={classNames.use(styles.section).join(className)}
    tag="section"
  >
    <div className={styles.formWrapper}>
      <div className={styles.formInnerWrapper}>
        <Card.Title tag="h2">{title}</Card.Title>
        {subTitle}
        <div className={styles.userMainWrapper}>
          {userData?.map((item) => (
            <div className={styles.userWrapper}>
              <div className={styles.user}>
                <div className={styles.userName}>
                  {item.person ? item.person : `Not available.`}
                </div>
                <div className={styles.userName}>
                  {item.email ? item.email : `Not available.`}
                </div>
              </div>
              <p className={styles.subTitle}>{subDescription}</p>
              <div className={styles.additionalInfo}>
                {item.description ? item.description : `Not available.`}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.mainWarningWrapper} />
    </div>
  </Card>
)

export default AccessUsers
