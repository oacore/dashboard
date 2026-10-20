import { Button, Typography, Row, Col } from 'antd';

import type { TableDownloadAction } from '@components/common/CrTable/types.ts';

const { Text } = Typography;

export interface CrFooterProps {
    // Footer display props
    showFooter?: boolean;
    showLoadMore?: boolean;

    // Data props
    startRecord: number;
    endRecord: number;
    totalRecords: number;
    hasReachedTotal: boolean;

    // Text props
    footerText: (start: number, end: number, total: number) => string;
    loadMoreText?: string;

    // Action props
    onDownloadCsv?: () => void;
    onLoadMore?: () => void;
    loadMoreLoading?: boolean;
    downloadCsvLoading?: boolean;
    extraDownloads?: TableDownloadAction[];
}

export const CrFooter = ({
    showFooter = true,
    showLoadMore = false,
    startRecord,
    endRecord,
    totalRecords,
    hasReachedTotal,
    footerText,
    loadMoreText = 'Show More',
    onDownloadCsv,
    onLoadMore,
    loadMoreLoading = false,
    downloadCsvLoading = false,
    extraDownloads = [],
}: CrFooterProps) => {
    if (!showFooter && !showLoadMore) return null;

    const hasDownloads = Boolean(onDownloadCsv) || extraDownloads.length > 0;

    return (
        <Row className="footer-container">
            {showFooter && (
                <div className="footer-wrapper">
                    {hasDownloads && (
                        <div className="footer-download-actions">
                            {onDownloadCsv && (
                                <Button
                                    type="primary"
                                    onClick={onDownloadCsv}
                                    loading={downloadCsvLoading}
                                    className="footer-download-btn"
                                    aria-label="Download CSV"
                                >
                                    Download CSV
                                </Button>
                            )}
                            {extraDownloads.map((download) => (
                                <Button
                                    key={download.key}
                                    type="primary"
                                    onClick={download.onClick}
                                    loading={download.loading}
                                    className="footer-download-btn"
                                    aria-label={download.label}
                                >
                                    {download.label}
                                </Button>
                            ))}
                        </div>
                    )}
                    <div className="inner-footer-wrapper">
                        <Col className="footer-text-col">
                            <Text className="footer-text">
                                <span className="footer-text-full">
                                    {footerText(startRecord, endRecord, totalRecords)}
                                </span>
                                <span className="footer-text-short">
                                    {`${startRecord} - ${endRecord} of ${totalRecords}`}
                                </span>
                            </Text>
                        </Col>
                        {showLoadMore && !hasReachedTotal && (
                            <Col className="footer-loadmore-col">
                                <Button
                                    type="default"
                                    onClick={onLoadMore}
                                    loading={loadMoreLoading}
                                    disabled={hasReachedTotal}
                                    className="footer-loadmore-btn"
                                >
                                    {loadMoreText}
                                </Button>
                            </Col>
                        )}
                    </div>
                </div>
            )}
        </Row>
    );
};
