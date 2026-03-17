import React, { useState, useCallback, useMemo } from 'react';
import { Button, Popover, message } from 'antd';
import externalLink from '@/assets/icons/externalLink.svg';
import { TextData } from '@features/Das/texts';
import { useDataProviderStore } from '@/store/dataProviderStore';
import type { DasData } from '@features/Das/types/data.types.ts';
import { updateDasStatus } from '@features/Das/hooks/useDasData.ts';
import {CrStatusCard} from '@oacore/core-ui';

interface DasColumnProps {
    record: DasData;
    onStatusUpdate?: () => void;
}

const DasColumn: React.FC<DasColumnProps> = React.memo(({ record, onStatusUpdate }) => {
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const { selectedDataProvider } = useDataProviderStore();

    // Memoize the href to prevent string concatenation on every render
    const href = useMemo(() => `https://core.ac.uk/outputs/${record.articleId}`, [record.articleId]);

    // Memoize the status update handler
    const handleStatusUpdate = useCallback(async (e: React.MouseEvent, articleId: string, key: number) => {
        e.preventDefault();

        if (!selectedDataProvider?.id) {
            message.error('No data provider selected');
            return;
        }

        setLoadingStatus(true);

        try {
            await updateDasStatus(selectedDataProvider.id, articleId, key);

            // Call parent's refresh function instead of calling mutate directly
            onStatusUpdate?.();

            message.success('Status updated successfully');
            setPopoverOpen(false);
        } catch (error) {
            console.error('Error updating Das status:', error);
            message.error('Failed to update status');
        } finally {
            setLoadingStatus(false);
        }
    }, [selectedDataProvider?.id, onStatusUpdate]);

    // Memoize the status sentence
    const statusSentence = useMemo(() =>
        record.dataAccessSentence || 'No Das statement found',
        [record.dataAccessSentence]
    );

    // Memoize the StatusCard component
    const statusCard = useMemo(() => (
        <CrStatusCard
            handleStatusUpdate={handleStatusUpdate}
            statusSentence={statusSentence}
            loadingStatus={loadingStatus}
            href={href}
            articleId={record.articleId}
            texts={TextData}
        />
    ), [handleStatusUpdate, statusSentence, loadingStatus, href, record.articleId]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    return (
        <div
            className="das-column-wrapper"
            onClick={handleClick}
        >
            <Popover
                content={statusCard}
                trigger="click"
                placement="leftTop"
                overlayClassName="das-status-popover"
                open={popoverOpen}
                onOpenChange={setPopoverOpen}
            >
                <Button
                    type="link"
                    className="table-redirect-link"
                >
                    Review DAS
                    <img src={externalLink} alt="" />
                </Button>
            </Popover>
        </div>
    );
});

DasColumn.displayName = 'DasColumn';

export default DasColumn;
