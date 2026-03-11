import { useDownloadDataProviderCsv } from '@/hooks/useDownloadDataProviderCsv';

const DUPLICATES_CSV_CONFIG = {
    endpoint: 'duplicates',
    filenamePrefix: 'duplicates',
    mutationKey: 'duplicates/download-csv',
} as const;

export const useDownloadDuplicatesCsv = () =>
    useDownloadDataProviderCsv(DUPLICATES_CSV_CONFIG);
