import React, { useRef, useState } from 'react'
import { Icon } from '@oacore/design/lib/elements'

import styles from '../styles.module.css'
import Actions from '../../../components/actions'
import DefaultUploadView from './defaultUpload'
import SizeUploadIssue from './sizeUploadIssue'
import FormatUploadIssue from './formatUploadIssue'
import UploadSuccess from './uploadSuccess'

import { Card } from 'design'

const RrsCheckCard = ({ uploadPdf }) => {
  const [pdfFile, setPdfFile] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [sizeIssue, setSizeIssue] = useState(false)
  const [formatIssue, setFormatIssue] = useState(false)
  const uploadRef = useRef(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    const maxFileSize = 10 * 1024 * 1024
    uploadPdf(file)
    if (file) {
      if (file.size > maxFileSize) {
        setSizeIssue(true)
        setFormatIssue(false)
        setPdfFile(null)
        setUploadSuccess(false)
      } else if (
        file.type !== 'application/pdf' &&
        file.type !==
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        setFormatIssue(true)
        setPdfFile(null)
        setSizeIssue(false)
        setUploadSuccess(false)
      } else {
        setPdfFile(file)
        setSizeIssue(false)
        setFormatIssue(false)
        setUploadSuccess(false)
        setUploadSuccess(true)
      }
    }
  }

  const handleClick = () => {
    uploadRef.current.click()
  }

  const renderUploadVIew = React.useMemo(() => {
    if (sizeIssue) {
      return (
        <SizeUploadIssue
          uploadRef={uploadRef}
          handleClick={handleClick}
          handleFileChange={handleFileChange}
        />
      )
    }
    if (formatIssue && !sizeIssue) {
      return (
        <FormatUploadIssue
          uploadRef={uploadRef}
          handleClick={handleClick}
          handleFileChange={handleFileChange}
        />
      )
    }
    if (uploadSuccess) return <UploadSuccess />

    return (
      <DefaultUploadView
        uploadRef={uploadRef}
        pdfFile={pdfFile}
        handleFileChange={handleFileChange}
        handleClick={handleClick}
      />
    )
  }, [formatIssue, uploadSuccess, sizeIssue])

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
      {renderUploadVIew}
    </Card>
  )
}
export default RrsCheckCard
