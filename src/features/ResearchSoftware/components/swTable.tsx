import { useMemo, useEffect, useState } from 'react';
import { CrTable } from '@components/common/CrTable/CrTable';

import type { SwRow, SwTab } from '@features/ResearchSoftware/types/sw.types';
import { useSwStore } from '@features/ResearchSoftware/store/swStore';
import { createSwColumns } from '@features/ResearchSoftware/components/tableColumns';
import { SwSidebar } from '@features/ResearchSoftware/components/swSidebar';
import { useTablePaginationAndSort } from '@/hooks/useTablePaginationAndSort';
import {actions} from '@features/ResearchSoftware/components/tableActions.tsx';
import {getScrollConfig} from '@hooks/useScrollView.ts';

interface SwTableProps {
    activeTab: SwTab;
    rows: SwRow[];
    totalCount: number;
    loading?: boolean;
    hasMore?: boolean;
    loadMore?: () => void;
    isLoadingMore?: boolean;
}

const getRowKey = (r: SwRow): string => `${r.articleId}-${r.oai}`;

export const SwTable = ({
    rows,
    loading,
    isLoadingMore,
}: SwTableProps) => {
    const { searchTerm, setSearchTerm, sortField, sortOrder, handleSort, downloadCsv } = useSwStore();

    const columns = useMemo(() => createSwColumns(), []);

    const { visibleData, hasMore, handleLoadMore, totalLength } = useTablePaginationAndSort<SwRow>({
        data: rows,
        itemsPerPage: 10,
    });

    const [selectedKey, setSelectedKey] = useState<string | null>(null);

    const selectedRow = useMemo(() => {
        if (!selectedKey) return null;
        return visibleData.find((r) => getRowKey(r) === selectedKey) ?? null;
    }, [selectedKey, visibleData]);

    // Clear selection if selected row is no longer in visible data
    useEffect(() => {
        if (!selectedKey) return;
        const exists = visibleData.some((r) => getRowKey(r) === selectedKey);
        if (!exists) setSelectedKey(null);
    }, [visibleData, selectedKey]);

    const handleRowClick = (record: SwRow) => {
        setSelectedKey(getRowKey(record));
    };

    const handleCloseSidebar = () => {
        setSelectedKey(null);
    };

    return (
            <div id="readySwTable" className={`sw-layout ${selectedRow ? 'sw-layout-open' : 'sw-layout-closed'}`}>
                <div className="sw-layout-table">
                    <CrTable<SwRow>
                        data={visibleData}
                        columns={columns}
                        totalLength={totalLength}
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
                        showLoadMore={hasMore}
                        onLoadMore={handleLoadMore}
                        loadMoreText="Show more"
                        loadMoreLoading={isLoadingMore}
                        size="middle"
                        bordered={false}
                        rowKey={getRowKey}
                        scroll={getScrollConfig()}
                        tableProps={{
                            onRow: (record) => ({
                                onClick: () => handleRowClick(record),
                                style: { cursor: 'pointer' },
                            }),
                        }}
                    />
                </div>

                {selectedRow && (
                    <div className="sw-layout-sidebar">
                        <SwSidebar row={selectedRow} onClose={handleCloseSidebar} />
                    </div>
                )}
            </div>
    );
};
