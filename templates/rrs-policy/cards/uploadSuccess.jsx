import React from 'react'
import { Button } from '@oacore/design'

import success from '../../../components/upload/assets/successSvg.svg'
import text from '../../../texts/rrs-retention/rrs.yml'
import styles from './styles.module.css'

const UploadSuccess = () => (
  <div className={styles.uploadWrapper}>
    <div className={styles.successWrapper}>
      <div className={styles.titleWrapper}>
        <img src={success} alt="issueSvg" />
        <h3 className={styles.uploadTitle}>{text.upload.success.title}</h3>
      </div>
      <div className={styles.statusType}>CC-By</div>
    </div>
    <div className={styles.innerIssueWrapper}>
      <span className={styles.uploadTitle}>
        {text.upload.success.description}
      </span>
    </div>
    <div className={styles.uploadFooterButton}>
      <Button variant="contained">{text.upload.success.action.title}</Button>
    </div>
  </div>
)

export default UploadSuccess
