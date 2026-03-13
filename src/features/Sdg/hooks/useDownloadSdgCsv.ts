import { useDownloadDataProviderCsv } from '@/hooks/useDownloadDataProviderCsv';

const SDG_CSV_CONFIG = {
    endpoint: 'sdg',
    filenamePrefix: 'sdg-data',
    mutationKey: 'sdg/download-csv',
} as const;

export const useDownloadSdgCsv = () =>
    useDownloadDataProviderCsv(SDG_CSV_CONFIG);
