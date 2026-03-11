import { useDownloadDataProviderCsv } from '@/hooks/useDownloadDataProviderCsv';

const DOI_CSV_CONFIG = {
    endpoint: 'doi',
    filenamePrefix: 'doi-csv',
    mutationKey: 'doi/download-csv',
} as const;

export const useDownloadDoiCsv = () =>
    useDownloadDataProviderCsv(DOI_CSV_CONFIG);
