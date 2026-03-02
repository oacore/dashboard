import React from 'react';
import type { ReusableTableColumn } from '@components/common/CrTable/types';
import type { SdgTableDataItem } from '@features/Sdg/types/sdg.types.ts';
import { getSdgIcon } from '@components/common/CrSdgRendered/use-sdg-icon-renderer.tsx';
import "../styles.css"


export const createColumns = (): ReusableTableColumn<SdgTableDataItem>[] => [
    {
        key: 'oai',
        title: 'OAI',
        dataIndex: 'oai',
        render: (value: unknown) => {
            if (typeof value === 'string' && value) {
                const parts = value.split(':');
                return <span className="oai-cell">{parts[parts.length - 1] || '-'}</span>;
            }
            return <span className="oai-cell">-</span>;
        },
    },
    {
        key: 'sdg',
        title: 'SDG',
        dataIndex: 'sdg',
        render: (value: unknown) => {
            const sdgs = value as { type: string; score: string }[];
            if (!sdgs || sdgs.length === 0) return '-';

            const sortedSdg = [...sdgs].sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

            const firstTwoSdgIcons = sortedSdg
                .slice(0, 2)
                .map((item, index) => (
                    <React.Fragment key={`${item.type}-${index}`}>
                        {getSdgIcon(item.type, parseFloat(item.score))}
                    </React.Fragment>
                ));

            const additionalCount =
                sortedSdg.length > 2 ? `+${sortedSdg.length - 2}` : '';

            return (
                <div className="sdg-row">
                    {firstTwoSdgIcons}
                    {additionalCount && (
                        <span className="additional-count">
                            {additionalCount}
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        key: 'title',
        title: 'Title',
        dataIndex: 'title',
        render: (value: unknown) => <span>{value as string}</span>,
    },
    {
        key: 'authors',
        title: 'Authors',
        dataIndex: 'authors',
        render: (value: unknown) => {
            const authors = value as { name: string }[];
            if (!authors || authors.length === 0) return '-';
            return <span>{authors.map(a => a.name).join(', ')}</span>;
        },
    },
    {
        key: 'publishedDate',
        title: 'Published Date',
        dataIndex: 'publishedDate',
        sortable: true,
        render: (value: unknown) => {
            const date = value as string;
            if (!date) return '-';
            return <span>{new Date(date).toLocaleDateString()}</span>;
        },
    },
];

export const columns = createColumns();
