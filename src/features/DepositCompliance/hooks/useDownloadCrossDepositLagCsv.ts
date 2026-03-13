import { useDownloadDataProviderCsv } from '@/hooks/useDownloadDataProviderCsv';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { useDepositDatesStore } from '../store/depositDatesStore';
import { createSWRKey } from '@/config/swr';

const extractDatePart = (dateTimeString: string): string =>
    dateTimeString.split(' ')[0];

const CROSS_DEPOSIT_LAG_CSV_CONFIG = {
    endpoint: 'cross-deposit-lag',
    filenamePrefix: 'cross-deposit-lag',
    mutationKey: 'cross-deposit-lag/download-csv',
    pathBuilder: (dataProviderId: number) => {
        const { selectedSetSpec } = useDataProviderStore.getState();
        const { dateRange } = useDepositDatesStore.getState();
        const baseUrl = `/internal/data-providers/${dataProviderId}/cross-deposit-lag`;
        const params: Record<string, string> = {
            wait: 'true',
            accept: 'text/csv',
        };
        if (dateRange.startDate && dateRange.endDate) {
            params.fromDate = extractDatePart(dateRange.startDate);
            params.toDate = extractDatePart(dateRange.endDate);
        }
        if (selectedSetSpec) {
            params.set = selectedSetSpec;
        }
        return createSWRKey(baseUrl, params);
    },
} as const;

export const useDownloadCrossDepositLagCsv = () =>
    useDownloadDataProviderCsv(CROSS_DEPOSIT_LAG_CSV_CONFIG);
