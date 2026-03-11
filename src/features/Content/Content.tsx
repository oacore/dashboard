import { useEffect } from 'react';
import { ContentTable } from '@features/Content/components/ContentTable.tsx';
import { useWorksListData } from '@features/Content/hooks/useWorksData';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { useContentTableStore } from '@features/Content/store/contentStore';
export const ContentFeature = () => {
  const { selectedDataProvider } = useDataProviderStore();
  const {
    searchTerm,
    setSearchTerm,
    resetOnPageEnter,
    sortField,
    sortOrder,
    handleSort,
  } = useContentTableStore();
  useEffect(() => {
    return () => {
      resetOnPageEnter()
    }
  }, [resetOnPageEnter]);

  const {
    data: worksData,
    error,
    isLoading,
    isLoadingMore,
    loadMore,
    totalLength,
    hasMore
  } = useWorksListData(
    100,
    searchTerm,
    selectedDataProvider?.id || 0,
    sortField,
    sortOrder
  );

  return (
    <ContentTable
      data={worksData}
      loading={isLoading}
      error={error}
      searchable
      searchPlaceholder="Search by title, OAI, authors..."
      onSearch={setSearchTerm}
      searchValue={searchTerm}
      showLoadMore={hasMore}
      onLoadMore={loadMore}
      loadMoreText="Show more"
      totalLength={totalLength}
      loadMoreLoading={isLoadingMore}
      onSort={handleSort}
      defaultSortField={sortField}
      defaultSortOrder={sortOrder}
    />
  );
};
