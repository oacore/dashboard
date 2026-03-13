import type { TableProps } from 'antd/es/table';

export interface ActionItem<T = unknown> {
    key: string;
    label: string;
    icon?: React.ReactNode;
    onClick: (record: T) => void;
    disabled?: boolean | ((record: T) => boolean);
    danger?: boolean;
}

export interface ReusableTableColumn<T = unknown> {
    key: string;
    title: React.ReactNode;
    dataIndex?: string;
    width?: number | string;
    sortable?: boolean;
    searchable?: boolean;
    render?: (value: unknown, record: T, index: number) => React.ReactNode;
    align?: 'left' | 'right' | 'center';
    className?: string;
    sorter?: ((a: T, b: T) => number) | boolean;
    showSortIcon?: boolean;
}

// Sidebar content helpers (e.g. for close button in sider footer)
export interface SidebarContentHelpers {
    onClose: () => void;
}

// Sidebar configuration
export interface SidebarConfig<T = unknown> {
    enabled: boolean;
    content: (record: T, helpers?: SidebarContentHelpers) => React.ReactNode;
    title?: string | ((record: T) => React.ReactNode);
    width?: number;
    placement?: 'left' | 'right';
    onRowClick?: (record: T) => void;
    getState?: (record: T) => string | undefined;
}

// Drawer configuration
export interface DrawerConfig<T = unknown> {
    enabled: boolean;
    content: (record: T) => React.ReactNode;
    title?: string;
    width?: number;
    placement?: 'left' | 'right';
    onRowClick?: (record: T) => void;
}

// Row click configuration
export interface RowClickConfig<T = unknown> {
    type: 'dropdown' | 'sidebar' | 'drawer';
    content: (record: T) => React.ReactNode;
    onRowClick?: (record: T) => void;
    title?: string;
    width?: number;
    placement?: 'left' | 'right';
}

export interface ReusableTableProps<T = unknown> {
    // Data props
    data: T[];
    columns: ReusableTableColumn<T>[];
    loading?: boolean;
    error?: unknown;

    // Search props
    searchable?: boolean;
    searchPlaceholder?: string;
    onSearch?: (searchTerm: string) => void;
    searchValue?: string;

    // Sorting props
    sortable?: boolean;
    defaultSortField?: string;
    defaultSortOrder?: 'asc' | 'desc';
    onSort?: (field: string, order: 'asc' | 'desc' | null) => void;
    showSortIcon?: boolean;

    // Actions props
    actions?: ActionItem<T>[];

    // Row click props
    rowClick?: RowClickConfig<T>;

    // Sidebar and Drawer props
    sidebar?: SidebarConfig<T>;
    drawer?: DrawerConfig<T>;

    // Pagination props
    showPagination?: boolean;
    currentPage?: number;
    pageSize?: number;
    total?: number;
    onPageChange?: (page: number, size: number) => void;

    // Load more props
    showLoadMore?: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
    loadMoreText?: string;
    loadMoreLoading?: boolean;

    // Footer props
    showFooter?: boolean;
    totalLength?: number;
    footerText?: (start: number, end: number, total: number) => string;
    onDownloadCsv?: () => void;
    downloadCsvLoading?: boolean;

    // Table props
    size?: 'small' | 'middle' | 'large';
    bordered?: boolean;
    showHeader?: boolean;
    scroll?: { x?: number; y?: number };
    rowKey?: string | ((record: T) => string);
    className?: string;

    // Selection props
    rowSelection?: TableProps<T>['rowSelection'];

    // Additional table props
    tableProps?: Omit<TableProps<T>, 'dataSource' | 'columns' | 'loading'>;
}
