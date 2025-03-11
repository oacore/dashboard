import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import styles from '../styles.module.css'
import Actions from '../../../components/actions'
import DefaultUploadView from './defaultUpload'
import SizeUploadIssue from './sizeUploadIssue'
import FormatUploadIssue from './formatUploadIssue'
import UploadSuccess from './uploadSuccess'
import UploadFail from './uploadFail'
import rrs from '../../../texts/rrs-retention'
import infoAction from '../../../components/upload/assets/infoAction.svg'

import { Card } from 'design'

const RrsCheckCard = ({ uploadPdf, uploadResults, rrsPdfLoading }) => {
  const uploadRef = useRef(null)
  const [fileName, setFileName] = useState('')
  const router = useRouter()
  const providerId = router.query['data-provider-id']

  const [currentView, setCurrentView] = useState('default')

  const handleClick = () => {
    uploadRef.current.click()
  }

  useEffect(() => {
    if (uploadResults.rightsRetentionSentence) setCurrentView('success')
    if (
      !uploadResults.rightsRetentionSentence &&
      uploadResults.confidence === 0
    )
      setCurrentView('fail')
  }, [uploadResults])

  const handleDragOver = (event) => {
    event.preventDefault()
  }
  const handleFileChange = (event) => {
    event.preventDefault()
    if (rrsPdfLoading) return

    let file
    const { files } = event.dataTransfer || event.target

    if (files && files.length) {
      // eslint-disable-next-line prefer-destructuring
      file = files[0]
      uploadPdf(file, providerId)
      setFileName(file.name)
      if (file.size > 10 * 1024 * 1024) {
        setCurrentView('sizeIssue')
        return
      }
      const fileType = file.type
      if (
        !(
          fileType === 'application/pdf' ||
          fileType === 'application/msword' ||
          fileType ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
      ) {
        setCurrentView('formatIssue')
        return
      }
    }
    event.stopPropagation()
  }

  return (
    <Card
      onDragOver={handleDragOver}
      onDrop={handleFileChange}
      className={styles.cardWrapperBig}
      tag="section"
      title="RRS demo checker"
    >
      <div className={styles.headerWrapper}>
        <Card.Title className={styles.cardTitle} tag="h2">
          RRS demo checker
        </Card.Title>
        <Actions
          description={rrs.checkCard.info}
          hoverIcon={
            <img src={infoAction} style={{ color: '#757575' }} alt="" />
          }
        />
      </div>
      {currentView === 'default' && (
        <DefaultUploadView
          uploadRef={uploadRef}
          handleFileChange={handleFileChange}
          handleClick={handleClick}
          rrsPdfLoading={rrsPdfLoading}
          fileName={fileName}
        />
      )}
      {currentView === 'sizeIssue' && (
        <SizeUploadIssue
          uploadRef={uploadRef}
          handleClick={handleClick}
          handleFileChange={handleFileChange}
          rrsPdfLoading={rrsPdfLoading}
          fileName={fileName}
        />
      )}
      {currentView === 'formatIssue' && (
        <FormatUploadIssue
          uploadRef={uploadRef}
          handleClick={handleClick}
          handleFileChange={handleFileChange}
          rrsPdfLoading={rrsPdfLoading}
          fileName={fileName}
        />
      )}
      {currentView === 'success' && (
        <UploadSuccess
          uploadRef={uploadRef}
          handleClick={handleClick}
          handleFileChange={handleFileChange}
          uploadResults={uploadResults}
          rrsPdfLoading={rrsPdfLoading}
          fileName={fileName}
        />
      )}
      {currentView === 'fail' && (
        <UploadFail
          uploadRef={uploadRef}
          handleClick={handleClick}
          handleFileChange={handleFileChange}
          uploadResults={uploadResults}
          rrsPdfLoading={rrsPdfLoading}
          fileName={fileName}
        />
      )}
    </Card>
  )
}
export default RrsCheckCard
