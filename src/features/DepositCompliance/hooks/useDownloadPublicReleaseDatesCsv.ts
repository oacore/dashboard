import { useDownloadDataProviderCsv } from '@/hooks/useDownloadDataProviderCsv';
import { useDepositDatesStore } from '../store/depositDatesStore';

const PUBLIC_RELEASE_DATES_CSV_CONFIG = {
    endpoint: 'public-release-dates',
    filenamePrefix: 'public-release-dates',
    mutationKey: 'public-release-dates/download-csv',
    pathBuilder: (dataProviderId: number) => {
        const { dateRange } = useDepositDatesStore.getState();
        const params = new URLSearchParams({ wait: 'true' });
        if (dateRange.startDate && dateRange.endDate) {
            params.append('fromDate', dateRange.startDate);
            params.append('toDate', dateRange.endDate);
        }
        params.append('accept', 'text/csv');
        return `/internal/data-providers/${dataProviderId}/public-release-dates?${params.toString()}`;
    },
} as const;

export const useDownloadPublicReleaseDatesCsv = () =>
    useDownloadDataProviderCsv(PUBLIC_RELEASE_DATES_CSV_CONFIG);
