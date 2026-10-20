import { useDownloadDataProviderCsv } from '@/hooks/useDownloadDataProviderCsv';
import { useDataProviderStore } from '@/store/dataProviderStore';

import { useFreshFindsStore } from '../store/freshFindsStore';
import { buildFreshFindsWorksUrl } from './useFreshFindsData';

const FRESH_FINDS_ENDPOINT = 'fresh-finds/works';

const createFreshFindsDownloadConfig = (
  filenamePrefix: string,
  mutationKey: string,
  accept: string,
  fileExtension: string,
) => ({
  endpoint: FRESH_FINDS_ENDPOINT,
  filenamePrefix,
  mutationKey,
  accept,
  fileExtension,
  pathBuilder: (dataProviderId: number) => {
    const { searchTerm, depositFilter } = useFreshFindsStore.getState();
    const { selectedSetSpec } = useDataProviderStore.getState();

    return buildFreshFindsWorksUrl(dataProviderId, {
      searchTerm,
      depositFilters: depositFilter,
      setSpec: selectedSetSpec,
      accept,
    });
  },
});

const FRESH_FINDS_CSV_CONFIG = createFreshFindsDownloadConfig(
  'fresh-finds-csv',
  'fresh-finds/download-csv',
  'text/csv',
  'csv',
);

const FRESH_FINDS_JSON_CONFIG = createFreshFindsDownloadConfig(
  'fresh-finds-json',
  'fresh-finds/download-json',
  'application/json',
  'json',
);

const FRESH_FINDS_BIBTEX_CONFIG = createFreshFindsDownloadConfig(
  'fresh-finds-bibtex',
  'fresh-finds/download-bibtex',
  'application/x-bibtex',
  'bib',
);

const FRESH_FINDS_RESEARCH_CONFIG = createFreshFindsDownloadConfig(
  'fresh-finds-research',
  'fresh-finds/download-research',
  'application/x-research-info-systems',
  'ris',
);

export const useDownloadFreshFinds = () => {
  const csv = useDownloadDataProviderCsv(FRESH_FINDS_CSV_CONFIG);
  const json = useDownloadDataProviderCsv(FRESH_FINDS_JSON_CONFIG);
  const bibtex = useDownloadDataProviderCsv(FRESH_FINDS_BIBTEX_CONFIG);
  const research = useDownloadDataProviderCsv(FRESH_FINDS_RESEARCH_CONFIG);

  return {
    csv: { download: csv.downloadCsv, isLoading: csv.isLoading },
    json: { download: json.downloadCsv, isLoading: json.isLoading },
    bibtex: { download: bibtex.downloadCsv, isLoading: bibtex.isLoading },
    research: { download: research.downloadCsv, isLoading: research.isLoading },
  };
};
