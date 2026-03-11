import { useDownloadDataProviderCsv } from '@/hooks/useDownloadDataProviderCsv';

const ORCID_BASIC_CSV_CONFIG = {
    endpoint: 'orcid/basic',
    filenamePrefix: 'orcid-basic',
    mutationKey: 'orcid-basic/download-csv',
} as const;

export const useDownloadOrcidBasicCsv = () =>
    useDownloadDataProviderCsv(ORCID_BASIC_CSV_CONFIG);
