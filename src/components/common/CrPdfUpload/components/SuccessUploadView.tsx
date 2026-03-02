import React from 'react'
import { Button, Spin, Upload } from 'antd';
import type { UploadProps } from 'antd/es/upload'
import tickGreen from "@/assets/icons/tickGreen.svg"
import { LoadingOutlined } from '@ant-design/icons';
import type { UploadTexts } from '../CrPdfUpload'

interface SuccessUploadViewProps {
    fileName: string
    foundSentence: string
    licenseType?: string
    loading: boolean
    acceptedFormats: string[]
    uploadProps: UploadProps
    texts: UploadTexts
}

export const SuccessUploadView: React.FC<SuccessUploadViewProps> = ({
    fileName,
    foundSentence,
    licenseType,
    loading,
    uploadProps,
    texts
}) => {

    return (
        <div>
            {!loading ? (
                <>
                    <div className="pdf-upload-success-wrapper">
                        <div className="pdf-upload-title-wrapper">
                            <img src={tickGreen} alt="" />
                            <p className="pdf-upload-view-title success">
                                {texts.success.title}
                            </p>
                        </div>
                        {licenseType && licenseType !== 'not found' && (
                            <div className="pdf-upload-license-type">
                                {licenseType}
                            </div>
                        )}
                    </div>
                    <div className="pdf-upload-found-sentence">
                        <p className="pdf-upload-sentence-text">
                            "{foundSentence}"
                        </p>
                    </div>
                </>
            ) : (
                <div className="pdf-upload-loading-wrapper">
                    <div className="pdf-upload-spinner-wrapper">
                        <Spin indicator={<LoadingOutlined spin />} size="large" />
                    </div>
                    <p className="pdf-upload-file-name">{fileName}</p>
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
