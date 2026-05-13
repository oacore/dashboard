import { useDownloadDataProviderCsv } from '@/hooks/useDownloadDataProviderCsv';

import { buildFreshFindsInternalUrl } from '../constants/freshFindsProdApi';

const FRESH_FINDS_CSV_CONFIG = {
    endpoint: 'fresh-finds',
    filenamePrefix: 'fresh-finds-csv',
    mutationKey: 'fresh-finds/download-csv',
    pathBuilder: (dataProviderId: number) =>
        `${buildFreshFindsInternalUrl(dataProviderId)}?accept=text/csv`,
} as const;

export const useDownloadFreshFindsCsv = () =>
    useDownloadDataProviderCsv(FRESH_FINDS_CSV_CONFIG);
