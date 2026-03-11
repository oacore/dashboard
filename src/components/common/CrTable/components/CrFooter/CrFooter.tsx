import { Button, Typography, Row, Col } from 'antd';

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
}: CrFooterProps) => {
    if (!showFooter && !showLoadMore) return null;

    return (
        <Row className="footer-container">
            {showFooter && (
                <div className="footer-wrapper">
                    {onDownloadCsv && (
                        <Col className="footer-download-col">
                            <Button
                                type="primary"
                                onClick={onDownloadCsv}
                                loading={downloadCsvLoading}
                                className="footer-download-btn"
                            >
                                Download CSV
                            </Button>
                        </Col>
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
