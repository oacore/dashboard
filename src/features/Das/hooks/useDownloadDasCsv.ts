import { useDownloadDataProviderCsv } from '@/hooks/useDownloadDataProviderCsv';

const DAS_CSV_CONFIG = {
    endpoint: 'data-access',
    filenamePrefix: 'das',
    mutationKey: 'das/download-csv',
} as const;

export const useDownloadDasCsv = () =>
    useDownloadDataProviderCsv(DAS_CSV_CONFIG);
