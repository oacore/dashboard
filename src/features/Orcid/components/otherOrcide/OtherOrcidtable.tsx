import React, { useMemo } from 'react';
import type { OrcidData } from '@features/Orcid/types/data.types.ts';
import { createColumns } from '@features/Orcid/components/tableColumns.tsx';
import { actions } from '@features/Orcid/components/tableActions.tsx';
import { useOrcidStats, useOtherOrcidData } from '@features/Orcid/hooks/useOrcidData.ts';
import { useOrcidTableStore } from '@features/Orcid/store/orcidStore.ts';
import { CrTable } from '@/components/common/CrTable/CrTable.tsx';
import { CrDrawer } from '@/components/common/CrDrawer/CrDrawer.tsx';
import type { DrawerConfig } from '@components/common/CrTable/types';
import "../../styles.css"
import { useDataProviderStore } from '@/store/dataProviderStore.ts';
import { useArticleData } from '@hooks/useArticleData.ts';
import { getScrollConfig } from '@hooks/useScrollView.ts';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';
import { AccessPlaceholder } from '@core/core-ui';
import { useBillingPlanData } from '@features/Orcid/hooks/useBillingPlanData.ts';

export const OtherOrcidTable: React.FC = () => {

    const {
        searchTerm,
        setSearchTerm,
        selectedArticleId,
        setSelectedArticleId,
        downloadCsv,
    } = useOrcidTableStore();

    const { selectedDataProvider } = useDataProviderStore();
    const { organisation } = useOrganisation();

    const {
        data: accumulatedData,
        error: dataError,
        isLoading: dataLoading,
        isLoadingMore: loadMoreLoading,
        loadMore,
    } = useOtherOrcidData(50, searchTerm, selectedDataProvider?.id || 0);

    const { stats } = useOrcidStats(selectedDataProvider?.id || 0);

    const { isStartingPlan, displayData } = useBillingPlanData(accumulatedData, organisation);

    // Fetch article additional data when an article is selected
    const {
        data: articleData,
        error: articleError,
        isLoading: articleLoading,
        changeArticleVisibility,
        loading: articleActionLoading
    } = useArticleData(selectedArticleId);

    const columns = useMemo(() => createColumns(), []);

    const drawerConfig: DrawerConfig<OrcidData> = {
        enabled: true,
        content: (record: OrcidData) => (
            <div className="drawer-wrapper">
                <CrDrawer
                    article={articleData}
                    error={articleError}
                    isLoading={articleLoading || articleActionLoading}
                    removeLiveActions
                    onVisibilityChange={changeArticleVisibility}
                    outputsUrl={`https://core.ac.uk/outputs/${record.coreId}`}
                />
            </div>
        ),
        onRowClick: (record: OrcidData) => {
            const articleId = record.coreId;
            if (articleId) {
                setSelectedArticleId(articleId);
            }
        },
    };

    return (
        <div id="otherDataTable" className="other-orcid-table-wrapper">
            <CrTable<OrcidData>
                data={displayData}
                columns={columns}
                totalLength={stats?.fromOtherRepositories || 0}
                loading={dataLoading}
                error={dataError}
                actions={actions}
                searchable={!isStartingPlan}
                searchPlaceholder="Search by title, OAI, authors, or PIDs..."
                onSearch={setSearchTerm}
                searchValue={searchTerm}
                drawer={drawerConfig}
                onDownloadCsv={() => downloadCsv('/orcid/other-repos?accept=text/csv')}
                showLoadMore={!isStartingPlan}
                onLoadMore={loadMore}
                loadMoreText="Show more"
                loadMoreLoading={loadMoreLoading}
                showFooter={!isStartingPlan}
                size="middle"
                bordered={false}
                rowKey={(record) => `${record.coreId}-${record.oai}`}
                scroll={getScrollConfig()}
            />
            {isStartingPlan && (
                <AccessPlaceholder
                    description="Upgrade your membership to access all ORCID data and unlock advanced features."
                />
            )}
        </div>
    );
};

