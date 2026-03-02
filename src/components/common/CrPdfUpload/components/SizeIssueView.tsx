import React from 'react'
import { Button, Typography, Upload, Spin } from 'antd'
import type { UploadProps } from 'antd/es/upload'
import { LoadingOutlined } from '@ant-design/icons'
import issueSvg from '@/assets/icons/issue.svg';
import type { UploadTexts } from '../CrPdfUpload'

const { Text } = Typography

interface SizeIssueViewProps {
  fileName: string
  maxFileSize: number
  onUpload: (file: File) => Promise<boolean | void>
  loading: boolean
  acceptedFormats: string[]
  uploadProps: UploadProps
  texts: UploadTexts
}

export const SizeIssueView: React.FC<SizeIssueViewProps> = ({
  fileName,
  loading,
  uploadProps,
  texts
}) => {

  return (
    <div>
      {!loading ? (
        <>
          <div className="pdf-upload-error-content">
            <img src={issueSvg} alt="issueSvg" />
            <h3 className="upload-title">{texts.noSupport.sizeTitle}</h3>
          </div>
          <div className="inner-wrapper">
            <span className="inner-title">
              {texts.subInfo.size}
            </span>
          </div>
        </>
      ) : (
        <div className="pdf-upload-loading-wrapper">
          <div className="pdf-upload-spinner-wrapper">
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </div>
          <Text className="pdf-upload-file-name">{fileName}</Text>
        </div>
      )}
      <div className="pdf-upload-footer-button">
        <Upload {...uploadProps}>
          <Button
            type="primary"
            disabled={loading}
          >
            Try again
          </Button>
        </Upload>
      </div>
    </div>
  )
}
