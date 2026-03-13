import { useMemo } from 'react';
import { CrTable } from '@components/common/CrTable/CrTable';
import type { SidebarConfig } from '@components/common/CrTable/types';
import type { SwRow, SwTab } from '@features/ResearchSoftware/types/sw.types';
import { useSwStore } from '@features/ResearchSoftware/store/swStore';
import { createSwColumns } from '@features/ResearchSoftware/components/tableColumns';
import { SwSider } from '@features/ResearchSoftware/components/SwSider';
import { useTablePaginationAndSort } from '@/hooks/useTablePaginationAndSort';
import { actions } from '@features/ResearchSoftware/components/tableActions.tsx';
import { getScrollConfig } from '@hooks/useScrollView.ts';

interface SwTableProps {
    activeTab: SwTab;
    rows: SwRow[];
    totalCount: number;
    loading?: boolean;
    hasMore?: boolean;
    loadMore?: () => void;
    isLoadingMore?: boolean;
    downloadCsv: () => void;
    downloadCsvLoading?: boolean;
}

const getRowKey = (r: SwRow): string => `${r.articleId}-${r.oai}`;

export const SwTable = ({
    rows,
    loading,
    isLoadingMore,
    downloadCsv,
    downloadCsvLoading = false,
}: SwTableProps) => {
    const { searchTerm, setSearchTerm, sortField, sortOrder, handleSort } = useSwStore();

    const columns = useMemo(() => createSwColumns(), []);

    const { visibleData, hasMore, handleLoadMore, totalLength } = useTablePaginationAndSort<SwRow>({
        data: rows,
        itemsPerPage: 10,
    });

    const sidebarConfig: SidebarConfig<SwRow> = useMemo(() => ({
        enabled: true,
        width: 480,
        title: (record: SwRow) => <div className="sidebar-header">{record.oai}</div>,
        content: (record: SwRow, helpers) => (
            <div className="sider-drawer">
                <SwSider row={record} onClose={helpers?.onClose} />
            </div>
        ),
    }), []);

    return (
        <div id="readySwTable">
            <CrTable<SwRow>
                data={visibleData}
                columns={columns}
                totalLength={totalLength}
                sidebar={sidebarConfig}
                actions={actions}
                loading={loading}
                searchable
                searchPlaceholder="Search by title, OAI, authors..."
                onSearch={setSearchTerm}
                searchValue={searchTerm}
                sortable
                onSort={handleSort}
                defaultSortField={sortField || undefined}
                defaultSortOrder={sortOrder || undefined}
                onDownloadCsv={downloadCsv}
                downloadCsvLoading={downloadCsvLoading}
                showLoadMore={hasMore}
                onLoadMore={handleLoadMore}
                loadMoreText="Show more"
                loadMoreLoading={isLoadingMore}
                size="middle"
                bordered={false}
                rowKey={getRowKey}
                scroll={getScrollConfig()}
            />
        </div>
    );
};
