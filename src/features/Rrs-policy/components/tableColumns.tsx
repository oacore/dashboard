import type { ReusableTableColumn } from '@components/common/CrTable/types';
import { Tooltip } from 'antd';
import "../styles.css"
import questionMarkIcon from '@/assets/icons/questionMarkLight.svg';
import deny from '@/assets/icons/deny.svg';
import accept from '@/assets/icons/accept.svg';
import type { RrsData } from '@features/Rrs-policy/types/data.types.ts';
import RrsColumn from './RrsColumn';

// Helper function to get status icon and text
const getStatusIcon = (validationStatusRRS: unknown) => {
    const status = Number(validationStatusRRS);

    if (status === 0) {
        return {
            icon: <img src={questionMarkIcon} alt="questionMark" />,
            text: 'To be reviewed'
        };
    }
    if (status === 1) {
        return {
            icon: <img src={deny} alt="deny" />,
            text: 'Review not confirmed'
        };
    }
    return {
        icon: <img src={accept} alt="accept" />,
        text: 'Review confirmed'
    };
};

// Create the columns factory function to accept the onStatusUpdate callback
export const createColumns = (onStatusUpdate?: () => void): ReusableTableColumn<RrsData>[] => [
    {
        key: 'oai',
        title: 'Origin OAI',
        dataIndex: 'oai',
        sortable: true,
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
        sortable: true,
        align: 'left',
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
        render: (authors: unknown) => {
            // Type guard to check if authors is an array of strings
            if (!Array.isArray(authors) || authors.length === 0) {
                return '-';
            }

            // Filter to ensure we only have strings and join them
            const authorNames = authors
                .filter((author): author is string => typeof author === 'string')
                .join(', ');

            return (
                <div className="overflow-text">
                    {authorNames || '-'}
                </div>
            );
        },
    },
    {
        key: 'publicationDate',
        title: 'Publication Date',
        dataIndex: 'publicationDate',
        sortable: true,
        searchable: true,
        align: 'center',
        showSortIcon: true,
        sorter: (a: RrsData, b: RrsData) => {
            const dateA = new Date(a.publicationDate);
            const dateB = new Date(b.publicationDate);
            return dateA.getTime() - dateB.getTime();
        },
        render: (value: unknown) => (
            <div>
                {String(value)?.split('T')[0] || '-'}
            </div>
        ),
    },
    {
        key: 'licence',
        title: 'Identified licence',
        dataIndex: 'licenceRecognised',
        sortable: true,
        searchable: true,
        align: 'center',
        className: 'licence-column',
        render: (value: unknown) => {
            const licenceValue = String(value);

            if (!licenceValue || licenceValue === 'undefined' || licenceValue === 'null') {
                return <div className="licence">not found</div>;
            }
            return (
                <Tooltip
                    placement="top"
                    title={licenceValue}
                >
                    <div className="licence truncated">
                        {licenceValue.length > 10
                            ? `${licenceValue.substring(0, 10)}...`
                            : licenceValue}
                    </div>
                </Tooltip>
            );
        },
    },
    {
        key: 'rrs',
        title: 'Extracted RRS',
        dataIndex: 'rrs',
        sortable: true,
        searchable: true,
        align: 'center',
        className: 'publication-column',
        render: (_value: unknown, record: RrsData) => (
            <RrsColumn record={record} onStatusUpdate={onStatusUpdate} />
        ),
    },
    {
        key: 'status',
        title: 'Status',
        dataIndex: 'validationStatusRRS',
        sortable: true,
        searchable: true,
        align: 'center',
        className: 'visibility-status-column',
        render: (value: unknown) => {
            const statusInfo = getStatusIcon(value);

            return (
                <div>
                    <div className="status-wrapper">
                        <Tooltip
                            placement="top"
                            title={statusInfo.text}
                        >
                            {statusInfo.icon}
                        </Tooltip>
                    </div>
                </div>
            );
        },
    },
];

// Keep the old export for backward compatibility, but it won't have the callback
export const columns = createColumns();
