import type { OrcidData } from '@features/Orcid/types/data.types';
import type { ReusableTableColumn } from '@components/common/CrTable/types';
import "../styles.css"
import orcidId from '@/assets/icons/id.svg';

export const createColumns = (): ReusableTableColumn<OrcidData>[] => [
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
            // Type guard to check if authors is the expected array type
            if (!Array.isArray(authors) || authors.length === 0) {
                return '-';
            }
            const authorNames = authors
                .filter((author): author is { name: string } =>
                    typeof author === 'object' && author !== null && 'name' in author
                )
                .map(author => author.name)
                .join(', ');
            return (
                <div className="overflow-text">
                    {authorNames}
                </div>
            );
        },
    },
    {
        key: 'orcid',
        title: 'ORCID ID',
        dataIndex: 'author_pid',
        sortable: false,
        align: 'left',
        render: (authorPids: unknown) => {
            if (Array.isArray(authorPids) && authorPids.length > 0) {
                const additionalCount = authorPids.length > 1
                    ? `+${authorPids.length - 1}`
                    : '';

                return (
                    <span className="orcid-cell">
                        <img src={orcidId} alt="idIcon" />
                        <span className="overflow-text">{String(authorPids[0])}</span>
                        {additionalCount && (
                            <span className="additional-count">
                                {additionalCount}
                            </span>
                        )}
                    </span>
                );
            }
            return '-';
        },
    },
    {
        key: 'publicationDate',
        title: 'Publication Date',
        dataIndex: 'publicationDate',
        sortable: true,
        searchable: true,
        align: 'center',
        render: (value: unknown) => (
            <div>
                {String(value)?.split('T')[0] || '-'}
            </div>
        ),
    },
];

export const columns = createColumns();
