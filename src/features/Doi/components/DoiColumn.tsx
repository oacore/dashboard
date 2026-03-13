import type { ReusableTableColumn } from '@components/common/CrTable/types.ts';
import type { DoiData } from '@features/Doi/types/data.types.ts';
import '../styles.css';

export const createColumns = (
): ReusableTableColumn<DoiData>[] => [
        {
            key: 'repoDoi',
            title: 'DOI',
            dataIndex: 'crossrefDoi',
            align: 'left',
            className: 'repo-doi-column',
            render: (value: unknown) => {
                 if (value) {
                    return String(value);
                 }
                return (
                    <span className="doi-text-disabled">Not available</span>
                );
            },
        },
        {
            key: 'oai',
            title: 'OAI',
            dataIndex: 'oai',
            align: 'center',
            className: 'oai-column',
            render: (_value: unknown, record: DoiData) => {
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
            render: (_authors: unknown, record: DoiData) => {
                if (Array.isArray(record?.authors) && record.authors.length > 0) {
                    return record.authors.map((author) => author?.name.replace(/,/g, '')).join(', ');
                }
                return '-';
            },
        },
        {
            key: 'publicationDate',
            title: 'Publication date',
            dataIndex: 'publicationDate',
            align: 'center',
            className: 'publication-date-column',
            render: (value: unknown) => {
                return value ? String(value) : '-';
            },
        },
    ];

export const columns = createColumns();
