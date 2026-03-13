import { useCallback } from 'react';
import { postRequestFetcher } from '@/config/swr';
import { useSdgTableStore } from '../store/sdgStore';

interface UseGenerateSdgReportReturn {
    generateReport: (dataProviderId: number, emailUser: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    isReportGenerated: (dataProviderId: number) => boolean;
    lastGeneratedReportId: number | null;
    clearError: () => void;
}

export const useGenerateSdgReport = (): UseGenerateSdgReportReturn => {
    const {
        isGeneratingReport,
        reportGenerationError,
        lastGeneratedReportId,
        setIsGeneratingReport,
        setReportGenerationError,
        setLastGeneratedReportId,
        getReportGenerated,
        clearReportError,
    } = useSdgTableStore();

    const generateReport = useCallback(async (dataProviderId: number, emailUser: string) => {
        if (!dataProviderId || !emailUser) {
            throw new Error('Data provider ID and email are required');
        }

        setIsGeneratingReport(true);
        setReportGenerationError(null);

        await postRequestFetcher(
            `/internal/data-providers/${dataProviderId}/sdg/email`,
            { emailUser },
            true
        )
            .then(() => {
                localStorage.setItem(
                    `reportGenerated_${dataProviderId}`,
                    JSON.stringify(true)
                );
                setIsGeneratingReport(false);
                setReportGenerationError(null);
                setLastGeneratedReportId(dataProviderId);
            })
            .catch((err) => {
                console.error('Error generating SDG report:', err);
                setIsGeneratingReport(false);
                setReportGenerationError(
                    err instanceof Error ? err.message : 'Error generating SDG report'
                );
                throw err;
            });
    }, [setIsGeneratingReport, setReportGenerationError, setLastGeneratedReportId]);

    return {
        generateReport,
        isLoading: isGeneratingReport,
        error: reportGenerationError,
        isReportGenerated: getReportGenerated,
        lastGeneratedReportId,
        clearError: clearReportError,
    };
};

