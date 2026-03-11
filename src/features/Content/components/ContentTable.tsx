import React, { useMemo } from 'react';
import { CrTable } from '@/components/common/CrTable/CrTable.tsx';
import { CrPaper } from '@oacore/core-ui';
import { getScrollConfig } from '@hooks/useScrollView.ts';
import type { ContentData } from '@features/Content/types/data.types.ts';
import { createColumns } from '@features/Content/components/tableColumns.tsx';
import type { SidebarConfig } from '@/components/common/CrTable/types.ts';
import { useContentTableStore } from '@features/Content/store/contentStore';
import { useDownloadContentCsv } from '@features/Content/hooks/useDownloadContentCsv';

import "../styles.css"
import {ContentSider} from '@features/Content/components/ContentSider.tsx';

interface ContentTableProps {
  data: ContentData[];
  loading?: boolean;
  error?: Error | null;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  searchValue?: string;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  loadMoreText?: string;
  totalLength?: number;
  loadMoreLoading?: boolean;
  onSort?: (field: string, order: 'asc' | 'desc' | null) => void;
  defaultSortField?: string | null;
  defaultSortOrder?: 'asc' | 'desc' | null;
}

export const ContentTable: React.FC<ContentTableProps> = ({
  data,
  loading = false,
  error = null,
  searchable = false,
  searchPlaceholder = "Search content...",
  onSearch,
  searchValue,
  showLoadMore = false,
  onLoadMore,
  loadMoreText = "Show more",
  totalLength = 0,
  loadMoreLoading = false,
  onSort,
  defaultSortField,
  defaultSortOrder
}) => {


  const { allData } = useContentTableStore();
  const { downloadCsv, isLoading: isDownloadingCsv } = useDownloadContentCsv();

  const columns = useMemo(() => createColumns(), []);

  const sidebarConfig: SidebarConfig<ContentData> = {
    enabled: true,
    width: 480,
    title: (record: ContentData) => <div className={"sidebar-header"}>{record.oai}</div>,
    content: (record: ContentData) => (
      <div className="sider-drawer">
        <ContentSider record={record} />
      </div>
    ),
    getState: (record: ContentData) => {
      const currentRecord = allData.find(item => item.id === record.id) || record;
      if (currentRecord?.disabled) return 'disabled';
      if (!currentRecord?.fullText) return 'danger';
      return undefined;
    }
  };

  return (
    <CrPaper>
      <div id="contentTable">
        <CrTable<ContentData>
          data={data}
          columns={columns}
          totalLength={totalLength}
          loading={loading}
          error={error}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          onSearch={onSearch}
          searchValue={searchValue}
          sortable={true}
          onSort={onSort}  // Handles sort changes
          defaultSortField={defaultSortField || undefined} // Initial field: 'lastUpdate'
          defaultSortOrder={defaultSortOrder || undefined} // Initial order: 'desc'
          sidebar={sidebarConfig}
          onDownloadCsv={downloadCsv}
          downloadCsvLoading={isDownloadingCsv}
          showLoadMore={showLoadMore}
          onLoadMore={onLoadMore}
          loadMoreText={loadMoreText}
          loadMoreLoading={loadMoreLoading}
          size="middle"
          bordered={false}
          scroll={getScrollConfig()}
          rowKey={(record) => record.oai || 'unknown'}
        />
      </div>
    </CrPaper>
  );
};
