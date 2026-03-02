import React, { useState, useEffect } from 'react'
import { Card } from 'antd';
import InfoTooltip from '@components/common/InfoTooltip'
import {
    DefaultUploadView,
    SuccessUploadView,
    FailUploadView,
    FormatIssueView,
    SizeIssueView,
    UploadErrorView
} from './components'
import "./styles.css"
import type { UploadProps, RcFile } from 'antd/es/upload'

export interface UploadResults {
    confidence?: number
    rightsRetentionSentence?: string | null
    licenceRecognised?: string
    [key: string]: unknown
}

export interface UploadTexts {
    default: {
        subTitle: string
    }
    success: {
        title: string
    }
    fail: {
        title: string
        description: string
    }
    error: {
        title: string
        description: string
    }
    noSupport: {
        title: string
        sizeTitle: string
    }
    subInfo: {
        format: string
        size: string
    }
}

export interface CrPdfUploadProps {
    title: string
    onUpload: (file: File) => Promise<void>
    uploadResults?: UploadResults
    loading?: boolean
    foundSentence?: string | null
    licenseType?: string
    maxFileSize?: number // in MB, default 10MB
    acceptedFormats?: string[]
    showInfo?: boolean
    infoText?: string
    error?: string | null
    onResetResults?: () => void
    texts: UploadTexts
}

type ViewState = 'default' | 'success' | 'fail' | 'sizeIssue' | 'formatIssue' | 'uploadError'

export const CrPdfUpload: React.FC<CrPdfUploadProps> = ({
    title,
    onUpload,
    uploadResults = {},
    loading = false,
    foundSentence,
    licenseType,
    maxFileSize = 10,
    acceptedFormats = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    showInfo = false,
    infoText,
    error = null,
    onResetResults,
    texts
}) => {
    const [currentView, setCurrentView] = useState<ViewState>('default')
    const [fileName, setFileName] = useState('')

    useEffect(() => {
        if (loading) return;

        if (error) {
            setCurrentView('uploadError')
        } else if (foundSentence && foundSentence !== 'na') {
            setCurrentView('success')
        } else if ((!foundSentence && uploadResults.confidence === 0) || foundSentence === 'na') {
            setCurrentView('fail')
        } else if (!loading && !error && uploadResults && Object.keys(uploadResults).length === 0) {
            setCurrentView('default')
        }
    }, [uploadResults, foundSentence, error, loading])

    const validateFile = (file: File): { valid: boolean; error?: ViewState } => {
        if (file.size > maxFileSize * 1024 * 1024) {
            return { valid: false, error: 'sizeIssue' }
        }

        if (!acceptedFormats.includes(file.type)) {
            return { valid: false, error: 'formatIssue' }
        }

        return { valid: true }
    }

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        accept: acceptedFormats.join(','),
        beforeUpload: (file: RcFile) => {
            handleUpload(file)
            return false // Prevent default upload
        },
        showUploadList: false,
        disabled: loading
    }

    const handleUpload = async (file: File) => {
        const validation = validateFile(file)

        if (!validation.valid) {
            setCurrentView(validation.error!)
            setFileName(file.name)
            return false
        }

        setFileName(file.name)

        try {
            await onUpload(file)
        } catch (err) {
            console.error('Upload failed:', err)
        }

        return false // Prevent default upload behavior
    }

    const handleRetry = () => {
        setCurrentView('default')
        setFileName('')
        if (onResetResults) {
            onResetResults()
        }
    }

    const renderHeader = () => (
        <div className="pdf-upload-header">
            <h1 className="pdf-upload-title">
                {title}
            </h1>
            {showInfo && infoText && <InfoTooltip title={infoText} />}
        </div>
    )

    const renderContent = () => {
        const commonProps = {
            fileName,
            loading,
            onRetry: handleRetry,
            onUpload: handleUpload,
            acceptedFormats,
            uploadProps,
            texts
        }

        switch (currentView) {
            case 'success':
                return (
                    <SuccessUploadView
                        {...commonProps}
                        foundSentence={foundSentence || ''}
                        licenseType={licenseType}
                    />
                )
            case 'fail':
                return <FailUploadView {...commonProps} />
            case 'uploadError':
                return (
                    <UploadErrorView
                        {...commonProps}
                        error={error || ''}
                    />
                )
            case 'sizeIssue':
                return (
                    <SizeIssueView
                        {...commonProps}
                        maxFileSize={maxFileSize}
                    />
                )
            case 'formatIssue':
                return <FormatIssueView {...commonProps} />
            default:
                return <DefaultUploadView {...commonProps} />
        }
    }

    return (
        <Card className="pdf-upload-card">
            {renderHeader()}
            {renderContent()}
        </Card>
    )
}
