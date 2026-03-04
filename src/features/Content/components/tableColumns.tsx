import type { ReusableTableColumn } from '@components/common/CrTable/types';
import "../styles.css"
import type { ContentData } from '../types/data.types';

export const createColumns = (): ReusableTableColumn<ContentData>[] => [
    {
        key: 'oai',
        title: 'OAI',
        dataIndex: 'oai',
        sortable: false,
        align: 'center',
        className: 'oai-column',
        render: (value: unknown) => (
            <div className="oai-cell">
                {String(value).split(':').pop()}
            </div>
        ),
    },
    {
        key: 'title',
        title: 'Title',
        dataIndex: 'title',
        sortable: false,
        align: 'left',
        className: 'title-column',
        render: (value: unknown) => (
            <div className="overflow-text">
                {String(value)}
            </div>
        ),
    },
    {
        key: 'authors',
        title: 'Authors',
        dataIndex: 'authors',
        sortable: false,
        align: 'left',
        className: 'authors-column',
        render: (_, record: ContentData) => {
            const authors = record.authors;
            if (!Array.isArray(authors) || authors.length === 0) {
                return '-';
            }
            const authorNames = authors.map(author => author.name).join(', ');

            return (
                <div className="overflow-text">
                    {authorNames || '-'}
                </div>
            );
        },
    },
    {
        key: 'lastUpdate',
        title: 'Last Update',
        dataIndex: 'lastUpdate',
        sortable: true,
        align: 'center',
        className: 'last-update-column',
        showSortIcon: true,
        searchable: true,
        render: (_, record: ContentData) => {
            const formatDate = (dateString: string) => {
                return dateString?.split('T')[0] || '-';
            };

            return (
                <div>
                    {formatDate(record.lastUpdate)}
                </div>
            );
        },
    },
];

export const columns = createColumns();
