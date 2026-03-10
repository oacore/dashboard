import React, { useMemo } from 'react';
import { CrPaper, AccessPlaceholder } from '@core/core-ui';
import '../styles.css';
import type { DoiData } from '@features/Doi/types/data.types';
import { CrTable } from '@/components/common/CrTable/CrTable.tsx';
import { createColumns } from '@/features/Doi/components/DoiColumn';
import { useTablePaginationAndSort } from '@/hooks/useTablePaginationAndSort.ts';
import { articleTemplateData } from '@features/Doi/texts';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';
import { useBillingPlanData } from '@features/Orcid/hooks/useBillingPlanData.ts';
import { getScrollConfig } from '@hooks/useScrollView.ts';

interface DoiTableProps {
  doiData: DoiData[];
  isLoading: boolean;
  error: unknown;
  downloadCsv: () => void;
  onSearch?: (term: string) => void;
  searchValue?: string;
}

export const DoiTable: React.FC<DoiTableProps> = ({
  doiData,
  isLoading,
  error,
  downloadCsv,
  onSearch,
  searchValue,
}) => {
  const { organisation } = useOrganisation();
  const { isStartingPlan, displayData: billingPlanData } = useBillingPlanData(doiData, organisation);

  const {
    visibleData,
    hasMore,
    handleSort,
    handleLoadMore,
    totalLength,
  } = useTablePaginationAndSort<DoiData>({
    data: billingPlanData,
    itemsPerPage: 10,
  });

  const columns = useMemo(() => createColumns(), []);
  const footerCount = doiData.length;

  const dataWithUniqueKeys = useMemo(
    () => visibleData.map((record, index) => ({ ...record, __rowKey: `${record.id}-${record.oai}-${index}` })),
    [visibleData]
  );

  return (
    <CrPaper>
      <p
        className="doi-message"
        dangerouslySetInnerHTML={{
          __html: articleTemplateData.coverage.footer.replace('{{ count }}', footerCount.toString()),
        }}
      />
      <CrTable<DoiData & { __rowKey: string }>
        rowKey="__rowKey"
        loading={isLoading}
        error={error}
        data={dataWithUniqueKeys}
        columns={columns}
        actions={[]}
        sortable={!isStartingPlan}
        onSort={handleSort}
        onDownloadCsv={downloadCsv}
        showLoadMore={!isStartingPlan && hasMore}
        onLoadMore={handleLoadMore}
        loadMoreText="Show more"
        size="middle"
        bordered={false}
        showFooter={!isStartingPlan}
        totalLength={totalLength}
        searchable={true}
        onSearch={onSearch}
        searchValue={searchValue}
        scroll={getScrollConfig()}
      />
      {isStartingPlan && (
        <AccessPlaceholder
          customWidth
          description={articleTemplateData.coverage.upgradeBillingPlanText}
        />
      )}
    </CrPaper>
  );
};
