import { LinkOutlined } from '@ant-design/icons';

import type { ReusableTableColumn } from '@components/common/CrTable/types.ts';

import type { FreshFindsRecord } from '../types/data.types';
import { formatFreshFindsAuthors } from '../utils/freshFindsAuthors';

import '../FreshFindsFeature.css';

const buildDoiHref = (doi: string): string => {
    const trimmed = doi.trim();
    if (!trimmed) {
        return '';
    }
    return `https://doi.org/${encodeURIComponent(trimmed.replace(/^\s*https?:\/\/doi\.org\//i, ''))}`;
};

export const createColumns = (): ReusableTableColumn<FreshFindsRecord>[] => [
    {
        key: 'authors',
        title: 'Authors',
        dataIndex: 'affiliation_info',
        align: 'left',
        className: 'fresh-finds-column fresh-finds-column--authors',
        sortable: true,
        showSortIcon: true,
        sorter: (a: FreshFindsRecord, b: FreshFindsRecord) => {
            const sa = formatFreshFindsAuthors(a.affiliation_info).toLowerCase();
            const sb = formatFreshFindsAuthors(b.affiliation_info).toLowerCase();
            return sa.localeCompare(sb);
        },
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
        sorter: (a: FreshFindsRecord, b: FreshFindsRecord) => {
            const sa = a.DOI != null ? String(a.DOI).toLowerCase() : '';
            const sb = b.DOI != null ? String(b.DOI).toLowerCase() : '';
            return sa.localeCompare(sb);
        },
        render: (value: unknown, record: FreshFindsRecord) => {
            const doi = value != null ? String(value) : record.DOI != null ? String(record.DOI) : '';
            if (!doi) {
                return '-';
            }
            const href = buildDoiHref(doi);
            if (!href) {
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

export const getCustomSorters = (): Record<string, (a: FreshFindsRecord, b: FreshFindsRecord) => number> => {
    const columns = createColumns();
    const sorters: Record<string, (a: FreshFindsRecord, b: FreshFindsRecord) => number> = {};

    for (const column of columns) {
        if (column.sorter && typeof column.sorter === 'function') {
            sorters[column.key] = column.sorter as (a: FreshFindsRecord, b: FreshFindsRecord) => number;
        }
    }

    return sorters;
};