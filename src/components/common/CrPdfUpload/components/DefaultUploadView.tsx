import React from 'react'
import { Button, Typography, Spin } from 'antd'
import { FileTextOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd/es/upload'
import { Upload } from 'antd'
import upload from "@/assets/icons/upload.svg"
import type { UploadTexts } from '../CrPdfUpload'

const { Dragger } = Upload
const { Text } = Typography

interface DefaultUploadViewProps {
    onUpload: (file: File) => Promise<boolean | void>
    loading: boolean
    fileName: string
    acceptedFormats: string[]
    uploadProps: UploadProps
    texts: UploadTexts
}

export const DefaultUploadView: React.FC<DefaultUploadViewProps> = ({
    loading,
    fileName,
    uploadProps,
    texts
}) => {

    return (
        <div>
            {loading ? (
                <div className="pdf-upload-loading-wrapper">
                    <div className="pdf-upload-spinner-wrapper">
                        <Spin indicator={<LoadingOutlined spin />} size="large" />
                    </div>
                    <Text className="pdf-upload-file-name">{fileName}</Text>
                </div>
            ) : (
                <Dragger {...uploadProps} className="pdf-upload-dragger-view">
                    <div className="pdf-upload-drag-inner">
                        <img src={upload} className="pdf-upload-view-icon" />
                        <div className="pdf-upload-inner-title">
                            {texts.default.subTitle}
                            <Text className="pdf-upload-link-text">Click the upload button:</Text>
                        </div>
                        {fileName && (
                            <div className="pdf-upload-current-file">
                                <FileTextOutlined /> {fileName}
                            </div>
                        )}
                    </div>
                </Dragger>
            )}
            <div className="pdf-upload-footer-info">
                <Text className="pdf-upload-footer-text">
                    {texts.subInfo.format}
                </Text>
                <Text className="pdf-upload-footer-text">
                    {texts.subInfo.size}
                </Text>
            </div>
            <div className="pdf-upload-footer-button">
                <Upload {...uploadProps}>
                    <Button
                        type="primary"
                        disabled={loading}
                    >
                        Choose File
                    </Button>
                </Upload>
            </div>
        </div>
    )
}
