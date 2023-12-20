import { classNames } from '@oacore/design/lib/utils'
import React from 'react'
import { Button } from '@oacore/design/lib/elements'

import { Card } from '../../design'
import styles from './styles.module.css'

const AccessUsers = ({
  className,
  title,
  subTitle,
  subDescription,
  userData,
  toggleShowFullList,
  showFullList,
}) => {
  const displayAllUsers = showFullList ? userData : userData.slice(0, 2)
  return (
    <Card
      className={classNames.use(styles.section).join(className)}
      tag="section"
    >
      <div className={styles.formWrapper}>
        <div className={styles.formInnerWrapper}>
          <Card.Title tag="h2">{title}</Card.Title>
          {subTitle}
          <div className={styles.userMainWrapper}>
            {displayAllUsers?.map((item) => (
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
      {userData.length > 2 && (
        <Button
          className={styles.showBtn}
          variant="outlined"
          onClick={toggleShowFullList}
        >
          {showFullList ? 'Show Less' : 'Show More'}
        </Button>
      )}
    </Card>
  )
}

export default AccessUsers
