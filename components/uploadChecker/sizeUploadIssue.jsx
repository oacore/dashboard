import React from 'react'
import { Button } from '@oacore/design'

import issueSvg from '../upload/assets/issue.svg'
import styles from './styles.module.css'
import { ProgressSpinner } from '../../design'

const SizeUploadIssue = ({
  handleClick,
  handleFileChange,
  uploadRef,
  pdfLoading,
  fileName,
  text,
}) => (
  <div className={styles.uploadWrapper}>
    <div className={styles.titleWrapper}>
      {!pdfLoading ? (
        <>
          <img src={issueSvg} alt="issueSvg" />
          <h3 className={styles.uploadTitle}>
            {text.upload.noSupport.sizeTitle}
          </h3>
        </>
      ) : (
        <h3 className={styles.uploadTitle}>{text.upload.default.title}</h3>
      )}
    </div>
    {pdfLoading ? (
      <div className={styles.innerWrapper}>
        <div className={styles.spinnerWrapper}>
          <ProgressSpinner className={styles.spinner} />
        </div>
        <h6 className={styles.fileName}>{fileName}</h6>
      </div>
    ) : (
      <div className={styles.innerIssueWrapper}>
        <span className={styles.innerIssueTitle}>
          {text.upload.subInfo.size}
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
      <Button disabled={pdfLoading} onClick={handleClick} variant="contained">
        {text.upload.noSupport.action}
      </Button>
    </div>
  </div>
)

export default SizeUploadIssue
