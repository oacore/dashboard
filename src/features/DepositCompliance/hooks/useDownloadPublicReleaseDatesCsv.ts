import { useDownloadDataProviderCsv } from '@/hooks/useDownloadDataProviderCsv';
import { useDepositDatesStore } from '../store/depositDatesStore';

export type PublicReleaseCompliance = 'compliant' | 'non-compliant';

const buildPublicReleaseDatesCsvConfig = (compliance?: PublicReleaseCompliance) => ({
    endpoint: 'public-release-dates',
    filenamePrefix: compliance
        ? `public-release-dates-${compliance}`
        : 'public-release-dates',
    mutationKey: compliance
        ? `public-release-dates/download-csv/${compliance}`
        : 'public-release-dates/download-csv',
    pathBuilder: (dataProviderId: number) => {
        const { dateRange } = useDepositDatesStore.getState();
        const params = new URLSearchParams({ wait: 'true' });
        if (dateRange.startDate && dateRange.endDate) {
            params.append('fromDate', dateRange.startDate);
            params.append('toDate', dateRange.endDate);
        }
        if (compliance) {
            params.append('compliance', compliance);
        }
        params.append('accept', 'text/csv');
        return `/internal/data-providers/${dataProviderId}/public-release-dates?${params.toString()}`;
    },
});

const PUBLIC_RELEASE_DATES_CSV_CONFIGS = {
    all: buildPublicReleaseDatesCsvConfig(),
    compliant: buildPublicReleaseDatesCsvConfig('compliant'),
    'non-compliant': buildPublicReleaseDatesCsvConfig('non-compliant'),
};

export const useDownloadPublicReleaseDatesCsv = (
    compliance?: PublicReleaseCompliance
) => useDownloadDataProviderCsv(
    compliance
        ? PUBLIC_RELEASE_DATES_CSV_CONFIGS[compliance]
        : PUBLIC_RELEASE_DATES_CSV_CONFIGS.all
);
