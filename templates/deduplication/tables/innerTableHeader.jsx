import { classNames } from '@oacore/design/lib/utils'
import React from 'react'

import styles from '../styles.module.css'
import arrowLeft from '../../../components/upload/assets/ArrowLeft.svg'
import { Button } from '../../../design'
import texts from '../../../texts/deduplication/deduplication.yml'
import lock from '../../../components/upload/assets/lock.svg'

const InnerTableHeader = ({
  onClick,
  handleButtonToggle,
  compare,
  rowData,
}) => (
  <>
    <div className={styles.moreHeaderWrapper}>
      {/* eslint-disable-next-line max-len */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={onClick} className={styles.backWrapper}>
        <img src={arrowLeft} alt="" />
        <div>Back</div>
      </div>
      <Button
        onClick={handleButtonToggle}
        variant={compare ? 'contained' : 'outlined'}
      >
        {compare ? texts.moreInfo.action : texts.moreInfoComparison.action}
      </Button>
    </div>
    <div className={styles.compareItem}>
      <p className={classNames.use(styles.oaiItem)}>
        {rowData?.oai.split(':').pop()}
      </p>
      <p className={classNames.use(styles.columnItem)}>{rowData?.title}</p>
      <p className={classNames.use(styles.columnItem)}>
        {rowData?.authors.map((author) => author).join(' ')}
      </p>
      <div className={classNames.use(styles.reviewItem)}>
        <p>Need to be reviewed</p>
      </div>
      <p className={classNames.use(styles.dateItem)}>
        {rowData?.publicationDate}
      </p>
      <img src={lock} alt="lock" />
    </div>
  </>
)

export default InnerTableHeader
