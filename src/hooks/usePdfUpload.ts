import { useState, useCallback } from 'react'
import { postRequestFetcher } from '@/config/swr'
import { useDataProviderStore } from '@/store/dataProviderStore'

export interface PdfUploadResult {
    confidence?: number
    // RRS fields
    rightsRetentionSentence?: string | null
    licenceRecognised?: string
    // Das fields
    dataAccessSentence?: string | null
    dataAccessUrl?: string
    [key: string]: unknown
}

export interface UsePdfUploadReturn {
    handlePdfUpload: (file: File) => Promise<void>
    uploadResults: PdfUploadResult
    isLoading: boolean
    error: string | null
    resetResults: () => void
}

export const usePdfUpload = (endpoint: string): UsePdfUploadReturn => {
    const { selectedDataProvider } = useDataProviderStore()
    const [uploadResults, setUploadResults] = useState<PdfUploadResult>({})
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handlePdfUpload = useCallback(async (file: File) => {
        const dataProviderId = selectedDataProvider?.id
        if (!dataProviderId) {
            console.error('No data provider ID available')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.set('file', file)
            formData.set('dataProviderId', dataProviderId.toString())

            const data = await postRequestFetcher(
                endpoint,
                formData,
                true, // withCredentials
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            ) as PdfUploadResult

            setUploadResults(data)
        } catch (err) {
            const errorMessage = 'Upload failed'
            setError(errorMessage)
            console.error('PDF Upload Error:', err)
            setUploadResults({})
        } finally {
            setIsLoading(false)
        }
    }, [endpoint, selectedDataProvider?.id])

    const resetResults = useCallback(() => {
        setUploadResults({})
        setError(null)
    }, [])

    return {
        handlePdfUpload,
        uploadResults,
        isLoading,
        error,
        resetResults,
    }
}
