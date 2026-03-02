import { useState, useCallback, useMemo } from 'react';
import { Table, Drawer } from 'antd';
import type { MenuProps } from 'antd';
import type { SorterResult, TablePaginationConfig, FilterValue } from 'antd/es/table/interface';
import classNames from 'classnames';
import "./styles.css"
import { CrSearchBar } from '@components/common/CrTable/components/SearchBar/searchBar.tsx';
import { CrFooter } from '@components/common/CrTable/components/CrFooter/CrFooter.tsx';
import { CrTableColumns } from '@components/common/CrTable/components/CrColumns/CrTableColumns.tsx';
import { CrExpandableRowConfig } from '@components/common/CrTable/components/CrExpandableRow/CrExpandableRowConfig.tsx';
import type { ReusableTableProps } from './types';

export const CrTable = <T = unknown>({
    // Data props
    data = [],
    columns = [],
    loading = false,
    error = null,
    // Search props
    searchable = false,
    searchPlaceholder = 'Any identifier, title, author...',
    onSearch,
    searchValue = '',
    // Sorting props
    sortable = false,
    defaultSortField,
    defaultSortOrder,
    onSort,
    showSortIcon = false,
    // Actions props
    actions = [],
    // Row interaction props
    sidebar,
    drawer,
    // Load more props
    showLoadMore = false,
    onLoadMore,
    loadMoreText = 'Show More',
    loadMoreLoading = false,
    // Footer props
    showFooter = true,
    totalLength,
    footerText = (start: number, end: number, totalLength: number) =>
        `Showing ${start} - ${end} records of ${totalLength} records`,
    onDownloadCsv,
    // Table props
    size = 'middle',
    bordered = false,
    showHeader = true,
    scroll,
    rowKey = 'id',
    rowSelection,
    tableProps = {},
    className,
}: ReusableTableProps<T>) => {
    const [sortField, setSortField] = useState<string | undefined>(defaultSortField);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(defaultSortOrder || null);
    const [expandedRowKey, setExpandedRowKey] = useState<string | null>(null);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<T | null>(null);

    const handleTableChange = useCallback((
        _pagination: TablePaginationConfig,
        _filters: Record<string, FilterValue | null>,
        sorter: SorterResult<T> | SorterResult<T>[],
    ) => {
        // Handle single sorter
        const currentSorter = Array.isArray(sorter) ? sorter[0] : sorter;

        const field = (currentSorter?.field as string) || sortField || "lastUpdate";

        // Convert Ant Design order to our format, with fallback to toggle
        let newOrder: 'asc' | 'desc';
        if (currentSorter?.order === 'ascend') {
            newOrder = 'asc';
        } else if (currentSorter?.order === 'descend') {
            newOrder = 'desc';
        } else {
            newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
        }

        setSortField(field);
        setSortOrder(newOrder);
        onSort?.(field, newOrder);
    }, [onSort, sortField, sortOrder]);

    // Row click handler
    const handleRowClick = useCallback((record: T) => {
        if (sidebar?.enabled) {
            setSelectedRecord(record);
            setSidebarVisible(true);
            sidebar.onRowClick?.(record);
        } else if (drawer?.enabled) {
            const recordKey = typeof rowKey === 'function'
                ? rowKey(record)
                : String((record as Record<string, unknown>)[rowKey]);

            const shouldExpand = expandedRowKey !== recordKey;

            setExpandedRowKey(shouldExpand ? recordKey : null);
            setSelectedRecord(shouldExpand ? record : null);
            drawer.onRowClick?.(record);
        }
    }, [sidebar, drawer, rowKey, expandedRowKey]);

    // Memoized values
    const getActionMenuItems = useCallback((record: T): MenuProps['items'] => {
        return actions
            .filter(action => {
                if (typeof action.disabled === 'function') {
                    return !action.disabled(record);
                }
                return !action.disabled;
            })
            .map(action => ({
                key: action.key,
                label: action.label,
                icon: action.icon,
                danger: action.danger,
                onClick: () => action.onClick(record),
            }));
    }, [actions]);

    const tableColumns = useMemo(() => CrTableColumns({
        columns,
        sortable,
        sortField,
        sortOrder,
        showSortIcon,
        getActionMenuItems,
    }), [columns, sortable, sortField, sortOrder, showSortIcon, getActionMenuItems]);

    const expandableConfig = useMemo(() => CrExpandableRowConfig({
        drawer,
        expandedRowKey,
        rowKey,
        setExpandedRowKey,
        setSelectedRecord,
    }), [drawer, expandedRowKey, rowKey]);

    const paginationInfo = useMemo(() => ({
        startRecord: 1,
        endRecord: data.length,
        totalRecords: totalLength || data.length,
        hasReachedTotal: totalLength ? data.length >= totalLength : false,
    }), [data.length, totalLength]);

    const hasRowClick = useMemo(() =>
        sidebar?.enabled || drawer?.enabled, [sidebar, drawer]);

    // Check if custom onRow is provided in tableProps
    const customOnRow = tableProps?.onRow;
    const shouldUseCustomOnRow = !!customOnRow && !hasRowClick;

    const emptyText = useMemo(() => {
        if (error) return 'Sorry, we couldn\'t download the page at the moment. Please try again in a few minutes.';
        if (data.length === 0 && !loading) return 'There are no data available.';
        return 'No data';
    }, [loading, error, data.length]);

    // Custom loading indicator with spinner and text
    const loadingIndicator = useMemo(() => (
        <div className="table-loading-indicator">
            <div className="table-loading-text">
                This may take a while, longer for larger repositories...
            </div>
        </div>
    ), []);

    const sidebarTitle = useMemo(() => {
        if (!sidebar?.title) return undefined;
        if (typeof sidebar.title === 'function') {
            return selectedRecord ? sidebar.title(selectedRecord) : undefined;
        }
        return sidebar.title;
    }, [sidebar, selectedRecord]);

    const handleSidebarClose = useCallback(() => {
        setSidebarVisible(false);
        setSelectedRecord(null);
    }, []);

    return (
        <div className={classNames('reusable-table', className)}>
            {searchable && (
                <CrSearchBar
                    placeholder={searchPlaceholder}
                    onSearch={onSearch}
                    value={searchValue}
                    allowClear
                    size={size}
                />
            )}

            <Table<T>
                {...tableProps}
                rootClassName="reusable-table"
                dataSource={loading ? [] : data}
                columns={tableColumns}
                loading={loading ? { indicator: loadingIndicator } : false}
                size={size}
                bordered={bordered}
                showHeader={showHeader}
                scroll={scroll}
                rowKey={rowKey}
                rowSelection={rowSelection}
                onChange={handleTableChange}
                pagination={false}
                expandable={expandableConfig}
                onRow={shouldUseCustomOnRow
                    ? customOnRow
                    : hasRowClick
                        ? (record) => ({
                            onClick: () => handleRowClick(record),
                            style: { cursor: 'pointer' }
                        })
                        : undefined}
                locale={{ emptyText }}
                style={{
                    ...tableProps?.style,
                }}
            />

            {sidebar?.enabled && (
                <Drawer
                    title={sidebarTitle}
                    placement={sidebar.placement || "right"}
                    onClose={handleSidebarClose}
                    open={sidebarVisible}
                    width={sidebar.width || 400}
                    className="reusable-table-sidebar"
                    rootClassName={selectedRecord && sidebar.getState
                        ? `reusable-table-sidebar-${sidebar.getState(selectedRecord)}`
                        : 'reusable-table-sidebar-default'}
                >
                    {selectedRecord && sidebar.content(selectedRecord)}
                </Drawer>
            )}

            <CrFooter
                showFooter={showFooter}
                showLoadMore={showLoadMore}
                startRecord={paginationInfo.startRecord}
                endRecord={paginationInfo.endRecord}
                totalRecords={paginationInfo.totalRecords}
                hasReachedTotal={paginationInfo.hasReachedTotal}
                footerText={footerText}
                loadMoreText={loadMoreText}
                onDownloadCsv={onDownloadCsv}
                onLoadMore={onLoadMore}
                loadMoreLoading={loadMoreLoading}
            />
        </div>
    );
};
