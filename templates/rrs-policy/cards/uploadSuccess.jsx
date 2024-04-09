import React from 'react'
import { Button } from '@oacore/design'

import success from '../../../components/upload/assets/successSvg.svg'
import text from '../../../texts/rrs-retention/rrs.yml'
import styles from './styles.module.css'
import { ProgressSpinner } from '../../../design'

const UploadSuccess = ({
  handleClick,
  handleFileChange,
  uploadRef,
  uploadResults,
  rrsPdfLoading,
  fileName,
}) => (
  <div className={styles.uploadWrapper}>
    {!rrsPdfLoading ? (
      <div className={styles.successWrapper}>
        <div className={styles.titleWrapper}>
          <img src={success} alt="issueSvg" />
          <h3 className={styles.uploadTitle}>{text.upload.success.title}</h3>
        </div>
        <div className={styles.statusType}>
          {uploadResults.licenceRecognised}
        </div>
      </div>
    ) : (
      <h3 className={styles.uploadTitle}>{text.upload.default.title}</h3>
    )}
    {rrsPdfLoading ? (
      <div className={styles.innerWrapper}>
        <div className={styles.spinnerWrapper}>
          <ProgressSpinner className={styles.spinner} />
        </div>
        <h6 className={styles.fileName}>{fileName}</h6>
      </div>
    ) : (
      <div className={styles.innerIssueWrapper}>
        <span className={styles.successTitle}>
          &quot;{uploadResults.rightsRetentionSentence}&quot;
        </span>
        <input
          ref={uploadRef}
          type="file"
          id="fileInput"
          accept="application/pdf"
          onChange={handleFileChange}
          className={styles.display}
          hidden
        />
      </div>
    )}
    <div className={styles.uploadFooterButton}>
      <Button
        disabled={rrsPdfLoading}
        onClick={handleClick}
        variant="contained"
      >
        {text.upload.success.action.title}
      </Button>
    </div>
  </div>
)

export default UploadSuccess
