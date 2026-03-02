import type { ReusableTableColumn } from '@components/common/CrTable/types.ts';
import type { DuplicateData } from '@features/Duplicates/types/data.types.ts';
import classNames from 'classnames';
import '../styles.css';

export const createColumns = (
): ReusableTableColumn<DuplicateData>[] => [
        {
            key: 'oai',
            title: 'OAI',
            dataIndex: 'oai',
            align: 'center',
            className: 'oai-column',
            render: (_value: unknown, record: DuplicateData) => {
                if (record?.oai) {
                    return (
                        <span className="oai-cell">
                            {record.oai.split(':').pop()}
                        </span>
                    );
                }
                return '-';
            },
        },
        {
            key: 'title',
            title: 'Title',
            dataIndex: 'title',
            align: 'left',
            className: 'title-column',
            render: (value: unknown) => {
                return value ? String(value) : '-';
            },
        },
        {
            key: 'authors',
            title: 'Authors',
            dataIndex: 'authors',
            align: 'left',
            className: 'authors-column',
            render: (_authors: unknown, record: DuplicateData) => {
                if (Array.isArray(record?.authors) && record.authors.length > 0) {
                    return record.authors.map((author) => author).join(' ');
                }
                return '-';
            },
        },
        {
            key: 'count',
            title: 'Matches',
            dataIndex: 'count',
            align: 'center',
            className: 'duplicate-column',
            render: (_value: unknown, record: DuplicateData) => {
                if (record?.count !== undefined) {
                    return (
                        <span className="duplicate-cell">
                            {`+ ${record.count} found`}
                        </span>
                    );
                }
                return '-';
            },
        },
        {
            key: 'status',
            title: 'Status',
            dataIndex: 'status',
            sortable: true,
            showSortIcon: true,
            align: 'center',
            className: 'duplicate-column',
            sorter: (a: DuplicateData, b: DuplicateData) => {
                // Helper function to determine status value for sorting
                const getStatusValue = (record: DuplicateData): number => {
                    if (!record?.duplicates || !Array.isArray(record.duplicates)) {
                        return 0; // "To review"
                    }
                    const types = record.duplicates.map((item) => item.type);
                    const hasUndefined = types.some((type) => type === undefined);
                    return hasUndefined ? 0 : 1; // 0 = "To review", 1 = "Reviewed"
                };

                return getStatusValue(a) - getStatusValue(b);
            },
            render: (_value: unknown, record: DuplicateData) => {
                if (!record?.duplicates || !Array.isArray(record.duplicates)) {
                    return <div className="to-review">To review</div>;
                }

                const types = record.duplicates.map((item) => item.type);
                const hasUndefined = types.some((type) => type === undefined);

                if (hasUndefined) {
                    return <div className="to-review">To review</div>;
                }
                return <div className="reviewed">Reviewed</div>;
            },
        },
        {
            key: 'version',
            title: 'Version',
            dataIndex: 'version',
            align: 'left',
            render: (_value: unknown, record: DuplicateData) => {
                if (!record?.duplicates || !Array.isArray(record.duplicates)) {
                    return '-';
                }

                return (
                    <div className="cell-wrapper">
                        {record.duplicates.map((item, index) => (
                            <div
                                key={index}
                                className={classNames('cell', {
                                    dash:
                                        item.type === 'notSameArticle' ||
                                        item.type === 'duplicate',
                                    'type-cell': item.type,
                                })}
                            >
                                {item.type === 'notSameArticle' ||
                                    item.type === 'duplicate'
                                    ? '-'
                                    : item.type || '-'}
                            </div>
                        ))}
                    </div>
                );
            },
        },
        {
            key: 'publicationDate',
            title: 'Publication date',
            dataIndex: 'publicationDate',
            sortable: true,
            showSortIcon: true,
            align: 'center',
            className: 'publication-date-column',
            sorter: (a: DuplicateData, b: DuplicateData) => {
                const dateA = a.publicationDate ? new Date(a.publicationDate) : null;
                const dateB = b.publicationDate ? new Date(b.publicationDate) : null;

                // Handle null/undefined values
                if (!dateA && !dateB) return 0;
                if (!dateA) return 1;
                if (!dateB) return -1;

                return dateA.getTime() - dateB.getTime();
            },
            render: (value: unknown) => {
                return value ? String(value) : '-';
            },
        },
    ];

// Extract custom sorters from columns for use with useTablePaginationAndSort
export const getCustomSorters = (): Record<string, (a: DuplicateData, b: DuplicateData) => number> => {
    const columns = createColumns();
    const sorters: Record<string, (a: DuplicateData, b: DuplicateData) => number> = {};

    columns.forEach((column) => {
        if (column.sorter && typeof column.sorter === 'function') {
            sorters[column.key] = column.sorter as (a: DuplicateData, b: DuplicateData) => number;
        }
    });

    return sorters;
};

export const columns = createColumns();
