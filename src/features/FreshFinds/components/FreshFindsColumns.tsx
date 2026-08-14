import { LinkOutlined } from '@ant-design/icons';

import type { ReusableTableColumn } from '@components/common/CrTable/types.ts';

import type { FreshFindsRecord } from '../types/data.types';

const renderCellText = (value: unknown): string => {
  const text = value != null ? String(value).trim() : '';
  return text !== '' ? text : '-';
};

export const createColumns = (): ReusableTableColumn<FreshFindsRecord>[] => [
  {
    key: 'authors',
    title: 'Author',
    dataIndex: 'authorDisplay',
    width: '18%',
    align: 'left',
    className: 'fresh-finds-column fresh-finds-column--authors',
    render: (_value: unknown, record: FreshFindsRecord) => {
      const text =
        record.authorDisplay?.trim() ||
        record.authors?.map((author) => author.trim()).filter(Boolean).join(', ') ||
        '';
      return renderCellText(text);
    },
  },
  {
    key: 'title',
    title: 'Title',
    dataIndex: 'title',
    width: '24%',
    align: 'left',
    className: 'fresh-finds-column fresh-finds-column--title',
    render: (value: unknown) => renderCellText(value),
  },
  {
    key: 'doi',
    title: 'DOI',
    dataIndex: 'doi',
    width: '16%',
    align: 'left',
    className: 'fresh-finds-column fresh-finds-column--doi',
    render: (value: unknown, record: FreshFindsRecord) => {
      const doi = value != null ? String(value).trim() : record.doi?.trim() ?? '';
      if (doi === '') {
        return '-';
      }

      return (
        <a
          href={`https://doi.org/${encodeURIComponent(doi)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fresh-finds__doi-link"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.stopPropagation();
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
  {
    key: 'type',
    title: 'Type',
    dataIndex: 'journals',
    width: '10%',
    align: 'left',
    className: 'fresh-finds-column fresh-finds-column--type',
    render: (_value: unknown, record: FreshFindsRecord) => {
      const types =
        record.journals?.flatMap(
          (journal) => journal.identifiers?.map((identifier) => identifier.type) ?? [],
        ) ?? [];
      const text = [...new Set(types.filter(Boolean))].join(', ');
      return renderCellText(text);
    },
  },
  {
    key: 'publicationDate',
    title: 'Publication date',
    dataIndex: 'publicationDate',
    width: '12%',
    align: 'left',
    className: 'fresh-finds-column fresh-finds-column--publication-date',
    render: (value: unknown) => renderCellText(value),
  },
  {
    key: 'alreadyInRepository',
    title: 'In repository',
    dataIndex: 'alreadyInRepository',
    width: '10%',
    align: 'left',
    className: 'fresh-finds-column fresh-finds-column--in-repository',
    render: (value: unknown) => (value === true ? 'Yes' : 'No'),
  },
];
