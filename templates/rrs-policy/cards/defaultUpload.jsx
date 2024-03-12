import React from 'react'
import { Button } from '@oacore/design'

import text from '../../../texts/rrs-retention/rrs.yml'
import uploadSvg from '../../../components/upload/assets/upload.svg'
import styles from './styles.module.css'

const DefaultUploadView = ({
  handleClick,
  pdfFile,
  uploadRef,
  handleFileChange,
}) => (
  <div className={styles.uploadWrapper}>
    {/* eslint-disable-next-line max-len */}
    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
    <div className={styles.innerWrapper} onClick={handleClick}>
      <img
        src={uploadSvg}
        alt="Upload Icon"
        style={{ width: '50px', height: '50px', marginBottom: '10px' }}
      />
      <div className={styles.innerTitle}>
        {text.upload.default.subTitle}
        <p className={styles.link}> Uploaded File: {pdfFile?.name}</p>
      </div>
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
    <div className={styles.uploadFooter}>
      <span className={styles.footerText}>{text.upload.subInfo.format}</span>
      <span className={styles.footerText}>{text.upload.subInfo.size}</span>
    </div>
    <div className={styles.uploadFooterButton}>
      <Button onClick={handleClick} variant="contained">
        {text.upload.default.action.title}
      </Button>
    </div>
  </div>
)

export default DefaultUploadView
