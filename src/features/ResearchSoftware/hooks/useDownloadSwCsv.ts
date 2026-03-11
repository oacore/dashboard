import { useDownloadDataProviderCsv } from '@/hooks/useDownloadDataProviderCsv';

const SW_CSV_CONFIG = {
    endpoint: 'sw-mentions',
    filenamePrefix: 'sw-data',
    mutationKey: 'sw/download-csv',
} as const;

export const useDownloadSwCsv = () =>
    useDownloadDataProviderCsv(SW_CSV_CONFIG);
