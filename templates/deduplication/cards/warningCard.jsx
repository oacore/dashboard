import React, { useEffect, useState } from 'react'
import { Button } from '@oacore/design/lib/elements'

import { Message } from '../../../design'
import styles from '../styles.module.css'
import info from '../../../components/upload/assets/info.svg'
import Markdown from '../../../components/markdown'
import texts from '../../../texts/deduplication/deduplication.yml'

const CompareWarning = () => {
  const [visibleWarning, setVisibleWarning] = useState(
    localStorage.getItem('visibleWarning') === 'true'
  )

  useEffect(() => {
    localStorage.setItem('visibleWarning', visibleWarning)
  }, [visibleWarning])
  return (
    <>
      <div className={styles.tableTitleWrapper}>
        <div className={styles.tableTitle}>{texts.moreInfo.tableTitle}</div>
        {!visibleWarning && (
          // eslint-disable-next-line max-len
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
          <div
            onClick={() => setVisibleWarning(true)}
            className={styles.showWrapper}
          >
            <span className={styles.tableTitle}>Show description</span>
            <img className={styles.showIcon} src={info} alt="description" />
          </div>
        )}
      </div>
      {visibleWarning && (
        <Message className={styles.dataErrorWrapper}>
          <div className={styles.dataErrorInnerWrapper}>
            <img className={styles.infoIcon} src={info} alt="description" />
            <Markdown className={styles.infoText}>
              {texts.moreInfo.description}
            </Markdown>
          </div>
          <div className={styles.hideButtonWrapper}>
            <Button
              className={styles.hideButton}
              onClick={() => setVisibleWarning(false)}
              variant="outlined"
            >
              Hide description
            </Button>
          </div>
        </Message>
      )}
    </>
  )
}

export default CompareWarning
