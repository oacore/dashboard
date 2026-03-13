import { useCallback, useMemo } from 'react';
import { useDownloadDataProviderCsv } from '@/hooks/useDownloadDataProviderCsv';

const createIssuesCsvConfig = (issueType: string) => ({
    endpoint: 'issues',
    filenamePrefix: `issues-${issueType}`,
    mutationKey: `issues/${issueType}/download-csv`,
    pathBuilder: (dataProviderId: number) =>
        `/internal/data-providers/${dataProviderId}/issues?type=${encodeURIComponent(issueType)}&accept=text/csv`,
}) as const;

const FALLBACK_CONFIG = {
    endpoint: 'issues',
    filenamePrefix: 'issues',
    mutationKey: 'issues/download-csv-fallback',
} as const;

export const useDownloadIssuesCsv = (issueType: string | undefined) => {
    const config = useMemo(
        () =>
            issueType ? createIssuesCsvConfig(issueType) : FALLBACK_CONFIG,
        [issueType]
    );

    const { downloadCsv: triggerDownload, isLoading, error } =
        useDownloadDataProviderCsv(config);

    const downloadCsv = useCallback(() => {
        if (!issueType) return;
        triggerDownload();
    }, [issueType, triggerDownload]);

    return {
        downloadCsv,
        isLoading: issueType ? isLoading : false,
        error: error ?? null,
    };
};
