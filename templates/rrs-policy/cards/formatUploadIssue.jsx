import React from 'react'
import { Button } from '@oacore/design'

import issueSvg from '../../../components/upload/assets/issue.svg'
import text from '../../../texts/rrs-retention/rrs.yml'
import styles from './styles.module.css'

const FormatUploadIssue = ({ handleClick, handleFileChange }) => (
  <div className={styles.uploadWrapper}>
    <div className={styles.titleWrapper}>
      <img src={issueSvg} alt="issueSvg" />
      <h3 className={styles.uploadTitle}>{text.upload.noSupport.title}</h3>
    </div>
    <div className={styles.innerIssueWrapper}>
      <span className={styles.innerIssueTitle}>
        {text.upload.subInfo.format}
      </span>
      <input
        // ref={uploadRef}
        type="file"
        id="fileInput"
        accept="application/pdf"
        onChange={handleFileChange}
        className={styles.display}
        hidden
      />
    </div>
    <div className={styles.uploadFooterButton}>
      <Button onClick={handleClick} variant="contained">
        {text.upload.noSupport.action}
      </Button>
    </div>
  </div>
)

export default FormatUploadIssue
