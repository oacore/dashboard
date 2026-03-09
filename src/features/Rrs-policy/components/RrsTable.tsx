import React, { useState, useMemo, useCallback } from 'react';
import { CrTable } from '@/components/common/CrTable/CrTable.tsx';
import type { DrawerConfig } from '@/components/common/CrTable/types.ts';
import { CrDrawer } from '@components/common/CrDrawer/CrDrawer.tsx';
import { useArticleData } from '@hooks/useArticleData.ts';
import { getScrollConfig } from '@hooks/useScrollView.ts';
import { useRrsStore } from '@features/Rrs-policy/store/rrsStore.ts';
import { useRrsData } from '@features/Rrs-policy/hooks/useRrsData.ts';
import { useDataProviderStore } from '@/store/dataProviderStore.ts';
import type { RrsData } from '@features/Rrs-policy/types/data.types.ts';
import { createColumns } from '@features/Rrs-policy/components/tableColumns.tsx';
import { actions } from '@features/Rrs-policy/components/tableActions.tsx';
import { CrPaper } from '@core/core-ui';
import DashboardTipMessage from '@/components/common/DashboardTipMessage/DashboardTipMessage';
import { TextData } from '@features/Rrs-policy/texts';
import { useTablePaginationAndSort } from '@/hooks/useTablePaginationAndSort.ts';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';
import { useBillingPlanData } from '@features/Orcid/hooks/useBillingPlanData.ts';
import { AccessPlaceholder } from '@components/common/AccessPlaceholder';

export const RrsTable: React.FC = () => {
  const [showHelpInfo, setShowHelpInfo] = useState(false);

  const {
    downloadCsv,
    selectedArticleId,
    setSelectedArticleId,
  } = useRrsStore();

  const { selectedDataProvider } = useDataProviderStore();
  const { organisation } = useOrganisation();

  const {
    data: accumulatedData,
    error: dataError,
    isLoading: dataLoading,
    mutate
  } = useRrsData(selectedDataProvider?.id || 0);

  const { isStartingPlan, displayData: billingPlanData } = useBillingPlanData(accumulatedData, organisation);

  const {
    data: articleData,
    error: articleError,
    isLoading: articleLoading,
    changeArticleVisibility,
    loading: articleActionLoading
  } = useArticleData(selectedArticleId);

  // Use the reusable hook for sorting and pagination
  const {
    visibleData,
    hasMore,
    handleSort,
    handleLoadMore,
    totalLength,
  } = useTablePaginationAndSort<RrsData & { [key: string]: unknown }>({
    data: billingPlanData as (RrsData & { [key: string]: unknown })[],
    itemsPerPage: 10,
  });

  // callback to handle status updates
  const handleStatusUpdate = useCallback(() => {
    mutate(); // Refresh the data when status is updated
  }, [mutate]);

  const columns = useMemo(() => createColumns(handleStatusUpdate), [handleStatusUpdate]);

  const drawerConfig: DrawerConfig<RrsData> = {
    enabled: true,
    content: (record: RrsData) => (
      <div className="drawer-wrapper">
        <CrDrawer
          article={articleData}
          error={articleError}
          isLoading={articleLoading}
          isChangingVisibility={articleActionLoading}
          onVisibilityChange={changeArticleVisibility}
          outputsUrl={`https://core.ac.uk/outputs/${record.articleId}`}
        />
      </div>
    ),
    onRowClick: (record: RrsData) => {
      const articleId = record.articleId;
      if (articleId) {
        setSelectedArticleId(articleId);
      }
    },
  };

  return (
    <CrPaper>
      <div className="table-header-wrapper">
        <h2 className="table-header">{TextData.table.title}</h2>
        <div className="table-sub-header">{TextData.table.subTitle}</div>
      </div>
      <DashboardTipMessage
        show={TextData.helpInfo.show}
        hide={TextData.helpInfo.hide}
        description={TextData.helpInfo.description}
        activeText={showHelpInfo}
        setText={setShowHelpInfo}
      />
      <div id="rrsTable">
        <CrTable<RrsData>
          data={visibleData}
          columns={columns}
          loading={dataLoading}
          error={dataError}
          actions={actions}
          sortable={!isStartingPlan}
          onSort={handleSort}
          drawer={drawerConfig}
          onDownloadCsv={downloadCsv}
          showLoadMore={!isStartingPlan && hasMore}
          onLoadMore={handleLoadMore}
          loadMoreText="Show more"
          size="middle"
          bordered={false}
          rowKey={(record) => `${record.articleId}-${record.oai}`}
          scroll={getScrollConfig()}
          totalLength={totalLength}
          showFooter={!isStartingPlan}
        />
        {isStartingPlan && (
          <AccessPlaceholder
            customWidth
            description="To see and download the full list of outputs with RRS statements found in your repository become our Supporting or Sustaining member."
          />
        )}
      </div>
    </CrPaper>
  );
};

