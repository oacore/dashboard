import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import DashboardTipMessage from '@components/common/DashboardTipMessage/DashboardTipMessage.tsx';
import { CrTable } from '@components/common/CrTable/CrTable.tsx';
import type { ReusableTableColumn } from '@components/common/CrTable/types.ts';
import { TextData } from '@features/Duplicates/texts';
import { createColumns } from './InnerTableColumn.tsx';
import '../styles.css';
import { actions } from '@features/Duplicates/components/tableActions.tsx';

export interface InnerTableItem {
    oai?: string;
    title?: string;
    authors?: string[];
    type?: string;
    publicationDate?: string;
    documentId?: string;
    [key: string]: unknown;
}

interface InnerTableProps {
    combinedArray: InnerTableItem[];
    handleRedirect: (e: React.MouseEvent, id: string) => void;
    handleButtonToggle?: () => void;
    loading?: boolean;
}

export const InnerTable: React.FC<InnerTableProps> = ({
    combinedArray,
    handleButtonToggle,
    handleRedirect,
    loading = false,
}) => {
    const [visibleWarning, setVisibleWarning] = useState<boolean>(
        localStorage.getItem('visibleWarning') === 'true'
    );

    useEffect(() => {
        localStorage.setItem('visibleWarning', String(visibleWarning));
    }, [visibleWarning]);

    useEffect(() => {
        if (!handleButtonToggle) return;
        handleButtonToggle();
    }, [handleButtonToggle]);

    const getBackgroundColor = (type?: string) => {
        if (type === 'duplicate') return 'duplicate';
        if (type === 'notSameArticle') return 'not-same-article';
        return 'other';
    };

    const columns = useMemo<ReusableTableColumn<InnerTableItem>[]>(() =>
        createColumns({
            handleRedirect,
            getBackgroundColor,
        }),
        [handleRedirect]
    );

    return (
        <div className="dup-content-wrapper">
            <div className={classNames('inner-message', { 'inner-message-expanded': visibleWarning })}>
                <div className="inner-message-title">{TextData.moreInfo.tableTitle}</div>
                <DashboardTipMessage
                    title={TextData.moreInfo.tableTitle}
                    show={TextData.moreInfo.show}
                    hide={TextData.moreInfo.hide}
                    description={TextData.moreInfo.description}
                    setText={setVisibleWarning}
                    activeText={visibleWarning}
                />
            </div>
            <CrTable<InnerTableItem>
                data={combinedArray}
                className="inner-table"
                columns={columns}
                actions={actions}
                loading={loading}
                showFooter={false}
                size="middle"
                bordered={false}
                rowKey={(record) => `${record.documentId || ''}-${record.oai || ''}`}
            />
        </div>
    );
};
