import { LinkOutlined } from '@ant-design/icons';

import type { ReusableTableColumn } from '@components/common/CrTable/types.ts';

import type { FreshFindsRecord } from '../types/data.types';
import { buildFreshFindsDoiHref } from '../utils/freshFindsDoi';
import { formatFreshFindsAuthors } from '../utils/freshFindsAuthors';

const sortAuthors = (a: FreshFindsRecord, b: FreshFindsRecord): number => {
  const sa = formatFreshFindsAuthors(a.affiliation_info).toLowerCase();
  const sb = formatFreshFindsAuthors(b.affiliation_info).toLowerCase();
  return sa.localeCompare(sb);
};

const sortDoi = (a: FreshFindsRecord, b: FreshFindsRecord): number => {
  const sa = a.DOI != null ? String(a.DOI).toLowerCase() : '';
  const sb = b.DOI != null ? String(b.DOI).toLowerCase() : '';
  return sa.localeCompare(sb);
};

/** Keys must match column `key` for {@link useTablePaginationAndSort} custom sorting. */
export const freshFindsCustomSorters: Record<
  string,
  (a: FreshFindsRecord, b: FreshFindsRecord) => number
> = {
  authors: sortAuthors,
  DOI: sortDoi,
};

export const createColumns = (): ReusableTableColumn<FreshFindsRecord>[] => [
  {
    key: 'authors',
    title: 'Authors',
    dataIndex: 'affiliation_info',
    width: '58%',
    align: 'left',
    className: 'fresh-finds-column fresh-finds-column--authors',
    sortable: true,
    showSortIcon: true,
    sorter: sortAuthors,
    render: (_value: unknown, record: FreshFindsRecord) => {
      const text = formatFreshFindsAuthors(record.affiliation_info);
      return text !== '' ? text : '-';
    },
  },
  {
    key: 'DOI',
    title: 'DOI',
    dataIndex: 'DOI',
    align: 'left',
    className: 'fresh-finds-column fresh-finds-column--doi',
    sortable: true,
    showSortIcon: true,
    sorter: sortDoi,
    render: (value: unknown, record: FreshFindsRecord) => {
      const doi =
        value != null ? String(value) : record.DOI != null ? String(record.DOI) : '';
      if (doi === '') {
        return '-';
      }
      const href = buildFreshFindsDoiHref(doi);
      if (href === '') {
        return '-';
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="fresh-finds__doi-link"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
            }
          }}
          aria-label={`Open DOI ${doi} in a new tab`}
        >
          <LinkOutlined className="fresh-finds__doi-icon" aria-hidden />
          {doi}
        </a>
      );
    },
  },
];
