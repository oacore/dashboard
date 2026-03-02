import { formatDate } from '@utils/helpers';
import type { ReusableTableColumn } from '@components/common/CrTable/types';
import type { PublicReleaseDatesItem } from '../store/publicReleaseDatesStore';
import { MatchingIcon } from './MatchingIcon';
import { statusToCaption } from './utils';

export const createColumns = (): ReusableTableColumn<PublicReleaseDatesItem>[] => [
  {
    key: 'oai',
    title: 'OAI',
    dataIndex: 'oai',
    sortable: false,
    align: 'center',
    className: 'oai-column',
    showSortIcon: false,
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
    showSortIcon: false,
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
    showSortIcon: false,
    render: (_, record: PublicReleaseDatesItem) => {
      const authors = record.authors;
      if (!Array.isArray(authors) || authors.length === 0) {
        return '-';
      }
      const authorNames = authors.map((a) => a.name).join(' ');

      return (
        <div className="overflow-text">
          {authorNames || '-'}
        </div>
      );
    },
  },
  {
    key: 'publicationDate',
    title: 'Publication date',
    dataIndex: 'publicationDate',
    sortable: false,
    align: 'center',
    className: 'deposit-date-column',
    showSortIcon: false,
    render: (_, record: PublicReleaseDatesItem) => {
      const { publicationDate: date, publicationDateMatchingLevel: status } = record;
      const showStatus = status && status !== 'full';
      const caption = showStatus ? statusToCaption(status) : null;

      return (
        <span title={caption || undefined}>
          {date ? formatDate(date) : '-'}
          {showStatus && <MatchingIcon status={status} />}
        </span>
      );
    },
  },
  {
    key: 'publicReleaseDate',
    title: 'Deposit date',
    dataIndex: 'publicReleaseDate',
    sortable: true,
    align: 'center',
    className: 'deposit-date-column',
    showSortIcon: true,
    render: (value: unknown) => {
      const dateValue = value as string | undefined;
      return dateValue ? formatDate(dateValue) : '-';
    },
  },
];

// Keep the old export for backward compatibility
export const columns = createColumns();
