import { useMemo, useEffect } from 'react';
import { useDoiData } from '@/features/Doi/hooks/useDoiData';
import { useDoiStatistics } from '@/features/Doi/hooks/useDoiStatistics';
import { useDataProviderStatistics } from '@/hooks/useDataProviderStatistics';
import { DoiTable } from '@features/Doi/components/DoiTable';
import { useDoiStore } from '@features/Doi/store/doiStore';
import { CrFeatureLayout } from '@core/core-ui';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { CrStatsCard } from '@components/common/CrStatsCard/CrStatsCard.tsx';
import { ExclamationCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { articleTemplateData } from '@features/Doi/texts';

import './styles.css';

const TABS = Object.fromEntries(
    articleTemplateData.tabs.map((tab) => [tab.key, tab])
) as Record<string, (typeof articleTemplateData.tabs)[0]>;

export const DoiFeature = () => {
    const { searchTerm, setSearchTerm, downloadCsv, resetOnPageEnter } = useDoiStore();

    useEffect(() => {
        resetOnPageEnter();
    }, [resetOnPageEnter]);

    const { selectedDataProvider, selectedSetSpec, statistics, doiStatistics } = useDataProviderStore();
    const { isLoading: isStatisticsLoading, error: statisticsError } = useDataProviderStatistics(
        selectedDataProvider?.id ?? null,
        selectedSetSpec
    );
    const { isLoading: isDoiStatsLoading, error: doiStatsError } = useDoiStatistics(
        selectedDataProvider?.id ?? null,
        selectedSetSpec
    );
    const { data: doiData, isLoading: doiLoading, errorMessage: doiError } = useDoiData(
        selectedDataProvider?.id,
        0,
        100,
        searchTerm
    );

    const isStatsLoading = isStatisticsLoading || isDoiStatsLoading;
    const statsError = statisticsError || doiStatsError;

    const stats = useMemo(() => {
        const total = statistics?.countMetadata ?? 0;
        const withDoi = doiStatistics?.dataProviderDoiCount ?? 0;
        const withoutDoi = total - withDoi;
        const otherRepos = (doiStatistics?.totalDoiCount ?? 0) - withDoi;
        const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);
        return { total, withDoi, withoutDoi, otherRepos, pct };
    }, [statistics?.countMetadata, doiStatistics?.dataProviderDoiCount, doiStatistics?.totalDoiCount]);

    return (
        <CrFeatureLayout>
            <div className="doi-stats">
                <CrStatsCard
                    loading={isStatsLoading}
                    title={TABS.withDoi?.label || 'Outputs with a DOI'}
                    caption={TABS.withDoi?.description}
                    infoText={TABS.withDoi?.helper}
                    showInfo={Boolean(TABS.withDoi?.helper)}
                    subValue={stats.withDoi}
                    percentageValue={stats.pct(stats.withDoi)}
                    icon={<CheckOutlined className="tick-icon" />}
                    iconClassName="green"
                    error={statsError}
                />
                <CrStatsCard
                    loading={isStatsLoading}
                    title={TABS.withoutDoi?.label || 'Outputs without a DOI'}
                    caption={TABS.withoutDoi?.description}
                    infoText={TABS.withoutDoi?.helper}
                    showInfo={Boolean(TABS.withoutDoi?.helper)}
                    subValue={stats.withoutDoi}
                    percentageValue={stats.pct(stats.withoutDoi)}
                    icon={<ExclamationCircleOutlined className="cross-icon" />}
                    iconClassName="red"
                    error={statsError}
                />
                <CrStatsCard
                    loading={isStatsLoading}
                    title={TABS.otherRepositories?.label || 'DOIs found in other repositories'}
                    caption={TABS.otherRepositories?.description}
                    infoText={TABS.otherRepositories?.helper}
                    showInfo={Boolean(TABS.otherRepositories?.helper)}
                    value={stats.otherRepos}
                    iconClassName="green"
                    error={statsError}
                />
            </div>
            <DoiTable
                doiData={doiData}
                onSearch={setSearchTerm}
                searchValue={searchTerm}
                isLoading={doiLoading}
                error={doiError}
                downloadCsv={downloadCsv}
            />
        </CrFeatureLayout>
    );
};
