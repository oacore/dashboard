import React, { useState, useCallback, useMemo } from 'react';
import { Button, Popover, message } from 'antd';
import type { RrsData } from '@features/Rrs-policy/types/data.types.ts';
import externalLink from '@/assets/icons/externalLink.svg';
import CrStatusCard from '@/components/common/CrStatusCard';
import { TextData } from '@features/Rrs-policy/texts';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { updateRrsStatus } from '@features/Rrs-policy/hooks/useRrsData';

interface RrsColumnProps {
    record: RrsData;
    onStatusUpdate?: () => void; // Add callback prop for parent to handle data refresh
}

const RrsColumn: React.FC<RrsColumnProps> = React.memo(({ record, onStatusUpdate }) => {
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
            await updateRrsStatus(selectedDataProvider.id, articleId, key);

            // Call parent's refresh function instead of calling mutate directly
            onStatusUpdate?.();

            message.success('Status updated successfully');
            setPopoverOpen(false);
        } catch (error) {
            console.error('Error updating RRS status:', error);
            message.error('Failed to update status');
        } finally {
            setLoadingStatus(false);
        }
    }, [selectedDataProvider?.id, onStatusUpdate]);

    // Memoize the status sentence
    const statusSentence = useMemo(() =>
        record.rightsRetentionSentence || 'No RRS statement found',
        [record.rightsRetentionSentence]
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
            className="rrs-column-wrapper"
            onClick={handleClick}
        >
            <Popover
                content={statusCard}
                trigger="click"
                placement="leftTop"
                overlayClassName="rrs-status-popover"
                open={popoverOpen}
                onOpenChange={setPopoverOpen}
            >
                <Button
                    type="link"
                    className="redirect-link"
                >
                    Review RRS
                    <img src={externalLink} alt="" />
                </Button>
            </Popover>
        </div>
    );
});

RrsColumn.displayName = 'RrsColumn';

export default RrsColumn;
