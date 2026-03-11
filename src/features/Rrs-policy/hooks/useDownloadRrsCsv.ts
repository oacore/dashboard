import { useDownloadDataProviderCsv } from '@/hooks/useDownloadDataProviderCsv';

const RRS_CSV_CONFIG = {
    endpoint: 'rights-retention',
    filenamePrefix: 'rights-retention',
    mutationKey: 'rrs/download-csv',
} as const;

export const useDownloadRrsCsv = () =>
    useDownloadDataProviderCsv(RRS_CSV_CONFIG);
