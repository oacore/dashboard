import React, { useEffect, useRef, useState } from 'react'
import { Icon } from '@oacore/design/lib/elements'
import { useRouter } from 'next/router'

import styles from '../styles.module.css'
import Actions from '../../../components/actions'
import DefaultUploadView from './defaultUpload'
import SizeUploadIssue from './sizeUploadIssue'
import FormatUploadIssue from './formatUploadIssue'
import UploadSuccess from './uploadSuccess'
import UploadFail from './uploadFail'

import { Card } from 'design'

const RrsCheckCard = ({ uploadPdf, uploadResults, rrsPdfLoading }) => {
  const uploadRef = useRef(null)
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
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    uploadPdf(file, providerId)
    if (file.size > 10 * 1024 * 1024) {
      setCurrentView('sizeIssue')
      return
    }
    if (file.type !== 'application/pdf') setCurrentView('formatIssue')
  }

  return (
    <Card className={styles.cardWrapperBig} tag="section" title="Your Title">
      <div className={styles.headerWrapper}>
        <Card.Title className={styles.cardTitle} tag="h2">
          Your Title
        </Card.Title>
        <Actions
          description="Your Description"
          hoverIcon={
            <Icon src="#alert-circle-outline" style={{ color: '#757575' }} />
          }
        />
      </div>
      {currentView === 'default' && (
        <DefaultUploadView
          uploadRef={uploadRef}
          handleFileChange={handleFileChange}
          handleClick={handleClick}
          rrsPdfLoading={rrsPdfLoading}
        />
      )}
      {currentView === 'sizeIssue' && (
        <SizeUploadIssue
          uploadRef={uploadRef}
          handleClick={handleClick}
          handleFileChange={handleFileChange}
          rrsPdfLoading={rrsPdfLoading}
        />
      )}
      {currentView === 'formatIssue' && (
        <FormatUploadIssue
          uploadRef={uploadRef}
          handleClick={handleClick}
          handleFileChange={handleFileChange}
          rrsPdfLoading={rrsPdfLoading}
        />
      )}
      {currentView === 'success' && (
        <UploadSuccess
          uploadRef={uploadRef}
          handleClick={handleClick}
          handleFileChange={handleFileChange}
          uploadResults={uploadResults}
          rrsPdfLoading={rrsPdfLoading}
        />
      )}
      {currentView === 'fail' && (
        <UploadFail
          uploadRef={uploadRef}
          handleClick={handleClick}
          handleFileChange={handleFileChange}
          uploadResults={uploadResults}
          rrsPdfLoading={rrsPdfLoading}
        />
      )}
    </Card>
  )
}
export default RrsCheckCard
