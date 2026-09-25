import { useDownloadDataProviderCsv } from '@/hooks/useDownloadDataProviderCsv';

const FRESH_FINDS_CSV_CONFIG = {
  endpoint: 'fresh-finds/works',
  filenamePrefix: 'fresh-finds-csv',
  mutationKey: 'fresh-finds/download-csv',
} as const;

export const useDownloadFreshFindsCsv = () =>
  useDownloadDataProviderCsv(FRESH_FINDS_CSV_CONFIG);
