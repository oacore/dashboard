import React, { useMemo } from 'react';
import { CrTable } from '@/components/common/CrTable/CrTable.tsx';
import { usePublicReleaseDates } from '../hooks/usePublicReleaseDates';
import { usePublicReleaseDatesStore } from '../store/publicReleaseDatesStore';
import type { PublicReleaseDatesItem } from '../store/publicReleaseDatesStore';
import { createColumns } from './tableColumns';
import { CrPaper } from '@core/core-ui';
import { useBillingPlanData } from '@features/Orcid/hooks/useBillingPlanData';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation';
import type { SidebarConfig } from '@/components/common/CrTable/types.ts';
import { PublicReleaseDatesSider } from './PublicReleaseDatesSider';
import { getScrollConfig } from '@hooks/useScrollView.ts';

interface PublicReleaseDatesTableProps {
  totalCount: number;
}

export const PublicReleaseDatesTable: React.FC<PublicReleaseDatesTableProps> = ({
  totalCount,
}) => {
  const { organisation } = useOrganisation();
  const {
    data,
    error,
    isLoading,
    isLoadingMore,
    loadMore,
  } = usePublicReleaseDates();

  const { isStartingPlan, displayData } = useBillingPlanData(data, organisation);

  const {
    searchTerm,
    sortField,
    sortOrder,
    setSearchTerm,
    handleSort,
    downloadCsv,
  } = usePublicReleaseDatesStore();

  const columns = useMemo(() => createColumns(), []);

  const sidebarConfig: SidebarConfig<PublicReleaseDatesItem> = {
    enabled: true,
    width: 480,
    title: (record: PublicReleaseDatesItem) => <div className="sidebar-header">{record.oai}</div>,
    content: (record: PublicReleaseDatesItem) => (
      <div className="sider-drawer">
        <PublicReleaseDatesSider record={record} />
      </div>
    ),
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSortChange = (field: string, order: 'asc' | 'desc' | null) => {
    handleSort(field, order || 'desc');
  };

  const hasError = !!error;
  const hasMore = displayData.length < totalCount;

  const dataWithUniqueKeys = useMemo(
    () =>
      displayData.map((item, index) => ({
        ...item,
        _rowKey: `${item.oai || item.id || 'unknown'}-${index}`,
      })),
    [displayData]
  );

  return (
    <CrPaper>
      <CrTable<PublicReleaseDatesItem & { _rowKey: string }>
        data={dataWithUniqueKeys}
        columns={columns}
        totalLength={totalCount}
        loading={isLoading}
        error={error}
        searchable={!hasError && !isStartingPlan}
        searchPlaceholder="Search papers..."
        onSearch={handleSearch}
        searchValue={searchTerm}
        sortable={!isStartingPlan}
        onSort={handleSortChange}
        defaultSortField={sortField || undefined}
        defaultSortOrder={sortOrder || undefined}
        sidebar={sidebarConfig}
        onDownloadCsv={downloadCsv}
        showLoadMore={!isStartingPlan && hasMore}
        scroll={getScrollConfig()}
        onLoadMore={loadMore}
        loadMoreText="Show more"
        loadMoreLoading={isLoadingMore}
        size="middle"
        bordered={false}
        rowKey="_rowKey"
      />
    </CrPaper>
  );
};
