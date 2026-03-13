import { useDownloadDataProviderCsv } from '@/hooks/useDownloadDataProviderCsv';

const ORCID_OTHER_CSV_CONFIG = {
    endpoint: 'orcid/other-repos',
    filenamePrefix: 'orcid-other',
    mutationKey: 'orcid-other/download-csv',
} as const;

export const useDownloadOrcidOtherCsv = () =>
    useDownloadDataProviderCsv(ORCID_OTHER_CSV_CONFIG);
