import React, { useState, useMemo, } from 'react';
import DashboardTipMessage from '@components/common/DashboardTipMessage/DashboardTipMessage.tsx';
import { TextData } from '@features/Duplicates/texts';
import { CrPaper, Markdown, CrMessage, AccessPlaceholder } from '@core/core-ui';
import '../styles.css';
import info from '@/assets/icons/info.svg';
import { CrTable } from '@components/common/CrTable/CrTable.tsx';
import type { DuplicateData } from '@features/Duplicates/types/data.types.ts';
import { getScrollConfig } from '@hooks/useScrollView.ts';
import { createColumns, getCustomSorters } from '@features/Duplicates/components/DuplicatesColumn.tsx';
import { useTablePaginationAndSort } from '@/hooks/useTablePaginationAndSort.ts';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';
import { useBillingPlanData } from '@features/Orcid/hooks/useBillingPlanData.ts';

interface DeduplicationTableProps {
  count: number;
  duplicatesData: DuplicateData[];
  isLoading: boolean;
  error: unknown;
  downloadCsv: () => void;
  onRowClick?: (record: DuplicateData) => void;
}

export const DeduplicationTable: React.FC<DeduplicationTableProps> = ({
  count,
  duplicatesData,
  isLoading,
  error,
  downloadCsv,
  onRowClick
}) => {
  const [showHelpInfo, setShowHelpInfo] = useState(false);
  const { organisation } = useOrganisation();
  const { isStartingPlan, displayData: billingPlanData } = useBillingPlanData(duplicatesData, organisation);

  // Get custom sorters from column definitions
  const customSorters = useMemo(() => getCustomSorters(), []);

  // Use the reusable hook for sorting and pagination
  const {
    visibleData,
    hasMore,
    handleSort,
    handleLoadMore,
    totalLength,
  } = useTablePaginationAndSort<DuplicateData>({
    data: billingPlanData as DuplicateData[],
    itemsPerPage: 10,
    customSorters,
  });

  const columns = useMemo(() => createColumns(), []);

  return (
    <CrPaper>
      <div className="table-header-wrapper">
        <h2 className="table-header">{TextData.table.title}</h2>
        <div className="table-sub-header">
          We have found <span className="item-count">{count}</span> items. Review and download them
          below.
        </div>
      </div>
      <DashboardTipMessage
        show={TextData.helpInfo.show}
        hide={TextData.helpInfo.hide}
        description={TextData.helpInfo.description}
        activeText={showHelpInfo}
        setText={setShowHelpInfo}
      />
      <CrMessage alignItems="flex-start" variant="warning" fill className="error-message">
        <img className="info-icon" src={info} alt="riox" />
        <Markdown className="message-text">
          {TextData.cachedInfo.title}
        </Markdown>
      </CrMessage>
      <div id="duplicateable">
        <CrTable<DuplicateData>
          data={visibleData}
          columns={columns}
          loading={isLoading}
          error={error}
          actions={[]}
          sortable={!isStartingPlan}
          onSort={handleSort}
          onDownloadCsv={downloadCsv}
          showLoadMore={!isStartingPlan && hasMore}
          onLoadMore={handleLoadMore}
          loadMoreText="Show more"
          size="middle"
          bordered={false}
          rowKey={(record) => `${record.articleId}-${record.oai || ''}`}
          scroll={getScrollConfig()}
          totalLength={totalLength}
          showFooter={!isStartingPlan}
          tableProps={{
            onRow: onRowClick ? (record) => ({
              onClick: () => onRowClick(record),
            }) : undefined
          }}
        />
        {isStartingPlan && (
          <AccessPlaceholder
            customWidth
            description="To see and download the full list of potential duplicates and alternative versions become our Supporting or Sustaining member"
          />
        )}
      </div>
    </CrPaper>
  );
};
