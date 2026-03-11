import { useDownloadDataProviderCsv } from '@/hooks/useDownloadDataProviderCsv';

const CONTENT_CSV_CONFIG = {
    endpoint: 'works',
    filenamePrefix: 'content-data',
    mutationKey: 'content/download-csv',
} as const;

export const useDownloadContentCsv = () =>
    useDownloadDataProviderCsv(CONTENT_CSV_CONFIG);
