
import React from 'react';
import { Button, Tooltip } from 'antd';
import { EyeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import type { ReusableTableColumn } from '@components/common/CrTable/types.ts';
import type { InnerTableItem } from './InnerTable.tsx';
import { TextData } from '@features/Duplicates/texts';
import '../styles.css';

interface CreateColumnsParams {
    handleRedirect: (e: React.MouseEvent, id: string) => void;
    getBackgroundColor: (type?: string) => string;
}

export const createColumns = ({
    handleRedirect,
    getBackgroundColor,
}: CreateColumnsParams): ReusableTableColumn<InnerTableItem>[] => [
        {
            key: 'oai',
            title: 'OAI',
            dataIndex: 'oai',
            align: 'center',
            className: 'oai-column',
            render: (_value: unknown, record: InnerTableItem) => {
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
            render: (_authors: unknown, record: InnerTableItem) => {
                if (Array.isArray(record?.authors) && record.authors.length > 0) {
                    return record.authors.map((author) => author).join(' ');
                }
                return '-';
            },
        },
        {
            key: 'status',
            title: (
                <div className="column-header-wrapper">
                    <span>Status</span>
                    <Tooltip title={TextData.moreInfo.duplicates} placement="top">
                        <QuestionCircleOutlined className="info" />
                    </Tooltip>
                </div>
            ),
            dataIndex: 'type',
            align: 'center',
            className: 'duplicate-column',
            render: (_value: unknown, record: InnerTableItem) => {
                if (record?.type) {
                    return (
                        <span
                            className={classNames(
                                'duplicate-cell-inner',
                                getBackgroundColor(record.type)
                            )}
                        >
                            {record.type}
                        </span>
                    );
                }
                return <div className="default">Need to be reviewed</div>;
            },
        },
        {
            key: 'publicationDate',
            title: (
                <div className="column-header-wrapper">
                    <span>Publication date</span>
                    <Tooltip title={TextData.moreInfo.publicationDate} placement="top">
                        <QuestionCircleOutlined className="info" />
                    </Tooltip>
                </div>
            ),
            dataIndex: 'publicationDate',
            align: 'center',
            className: 'publication-date-column',
            render: (value: unknown) => {
                return value ? String(value) : '-';
            },
        },
        {
            key: 'visibility',
            title: '',
            dataIndex: 'visibility',
            align: 'center',
            className: 'visibility-status-column',
            render: (_value: unknown, record: InnerTableItem) => {
                return (
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        className="visible-icon"
                        onClick={(e) => handleRedirect(e, record.documentId as string)}
                        aria-label="View in CORE"
                    />
                );
            },
        },
    ];