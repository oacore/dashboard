import { useMemo } from 'react';
import { CrPaper } from '@core/core-ui';
import { formatNumber } from '@utils/helpers.ts';
import { TextData } from '@features/Sdg/texts';
import { CrTable } from '@components/common/CrTable/CrTable.tsx';
import { getScrollConfig } from '@hooks/useScrollView.ts';
import type { SdgTableDataItem } from '@features/Sdg/types/sdg.types';
import type { DrawerConfig } from '@components/common/CrTable/types';
import '@features/Sdg/styles.css';
import { useArticleData } from '@hooks/useArticleData.ts';
import { CrDrawer } from '@components/common/CrDrawer/CrDrawer.tsx';
import { useSdgTableStore } from '@features/Sdg/store/sdgStore.ts';
import { createColumns } from '@features/Sdg/components/tableColumns.tsx';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';
import { useBillingPlanData } from '@features/Orcid/hooks/useBillingPlanData.ts';
import { AccessPlaceholder } from '@components/common/AccessPlaceholder';

interface SdgTableProps {
  outputCount: number;
  sdgTableData: SdgTableDataItem[];
  loadMore?: () => void;
  isLoadingMore?: boolean;
  loading?: boolean;
  hasMore?: boolean;
}

export const SdgTable = ({ outputCount, sdgTableData, hasMore, loadMore, isLoadingMore, loading }: SdgTableProps) => {
  const {
    searchTerm,
    setSearchTerm,
    downloadCsv,
    selectedArticleId,
    setSelectedArticleId,
    sortField,
    sortOrder,
    handleSort,
  } = useSdgTableStore();
  const { organisation } = useOrganisation();
  const { isStartingPlan, displayData: billingPlanData } = useBillingPlanData(sdgTableData, organisation);

  const {
    data: articleData,
    error: articleError,
    isLoading: articleLoading,
    changeArticleVisibility,
    loading: articleActionLoading
  } = useArticleData(selectedArticleId);

  const columns = useMemo(() => createColumns(), []);

  const drawerConfig: DrawerConfig<SdgTableDataItem> = {
    enabled: true,
    content: (record: SdgTableDataItem) => (
      <div className="drawer-wrapper">
        <CrDrawer
          article={articleData}
          error={articleError}
          isLoading={articleLoading || articleActionLoading}
          removeLiveActions
          onVisibilityChange={changeArticleVisibility}
          outputsUrl={`https://core.ac.uk/outputs/${record.id}`}
        />
      </div>
    ),
    onRowClick: (record: SdgTableDataItem) => {
      const articleId = String(record.id);
      if (articleId) {
        setSelectedArticleId(articleId);
      }
    },
  };

  return (
    <CrPaper>
      <div className="table-header-wrapper">
        <h2 className="table-header">{TextData.table.title}</h2>
        <div className="table-sub-header">We have found {formatNumber(outputCount)} papers tagged with SDGs.
          Review and download them below.</div>
      </div>
      <div id="sdgTable">
        <CrTable
          data={billingPlanData as SdgTableDataItem[]}
          columns={columns}
          totalLength={Number(outputCount)}
          loading={loading}
          // error={dataError}
          searchable={!isStartingPlan}
          searchPlaceholder="Search by title, OAI, authors, or PIDs..."
          onSearch={setSearchTerm}
          searchValue={searchTerm}
          sortable={!isStartingPlan}
          onSort={handleSort}
          defaultSortField={sortField || undefined}
          defaultSortOrder={sortOrder || undefined}
          drawer={drawerConfig}
          onDownloadCsv={() => downloadCsv('/sdg?accept=text/csv')}
          showLoadMore={!isStartingPlan && hasMore}
          onLoadMore={loadMore}
          loadMoreText="Show more"
          loadMoreLoading={isLoadingMore}
          size="middle"
          bordered={false}
          scroll={getScrollConfig()}
          rowKey={(record) => `${record.id}-${record.oai}`}
          showFooter={!isStartingPlan}
        />
        {isStartingPlan && (
          <AccessPlaceholder
            customWidth
            description="To see all SDG labeled papers become our Supporting or Sustaining member. Try [SDG Insights DEMO.](https://core.ac.uk/labs/sdg)"
          />
        )}
      </div>
    </CrPaper>
  )
}
