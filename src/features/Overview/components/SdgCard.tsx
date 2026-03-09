import { Card, Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';
import { useSdgYearData } from '@features/Sdg/hooks/useSdgYearData.ts';
import { useGenerateSdgReport } from '@features/Sdg/hooks/useGenerateSdgReport.ts';
import { useDataProviderStore } from '@/store/dataProviderStore.ts';
import { useDashboardRoute } from '@hooks/useDashboardRoute';
import { useAuthStore } from '@/store/authStore.ts';
import { useBillingPlanData } from '@features/Orcid/hooks/useBillingPlanData.ts';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';
import { sdgTypes } from '@components/common/CrSdgRendered/use-sdg-icon-renderer.tsx';
import { TextData as sdgTextData } from '@features/Sdg/texts';
import { formatNumber } from '@/utils/helpers.ts';
import { Markdown } from '@core/core-ui';
import allSdg from '@/assets/icons/allSdg.svg';
import '../styles.css';
import type { CustomContentProps, CustomTooltipProps, TreemapDataItem } from '@features/Overview/types.ts';


const CustomContent = (props: CustomContentProps) => {
    const { x = 0, y = 0, width = 0, height = 0, payload } = props;
    const name = payload?.name || props.name || '';
    const color = payload?.color || props.color || '#f5f5f5';

    if (!width || !height) return <g />;

    const fontSize = Math.min(width / 6, height / 3, 16);
    const displayText = width < 30 ? name.replace('SDG', '') : name;

    return (
        <g transform={`translate(${x},${y})`}>
            <rect
                width={width}
                height={height}
                fill={color}
                stroke="#fff"
                strokeWidth={2}
            />
            {width > 10 && height > 8 && (
                <text
                    x={width / 2}
                    y={height / 2}
                    className="treemap-text"
                    fontSize={fontSize}
                    textAnchor="middle"
                    dominantBaseline="middle"
                >
                    {displayText}
                </text>
            )}
        </g>
    );
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (!active || !payload?.[0]) return null;

    const { name, title, size, color } = payload[0].payload;
    return (
        <div className="tooltip">
            <p className="tooltip-title" style={{ color }}>
                {name} - {title}
            </p>
            <p className="tooltip-count">{formatNumber(size)} outputs</p>
        </div>
    );
};

export const SdgCard = () => {
    const { selectedDataProvider } = useDataProviderStore();
    const { user } = useAuthStore();
    const { organisation, isLoadingOrganisation } = useOrganisation();
    const { isStartingPlan } = useBillingPlanData([] as never[], organisation);

    const {
        sdgYearData,
        sdgYearDataLoading,
        isError: sdgYearDataError,
    } = useSdgYearData({
        dataProviderId: selectedDataProvider?.id || null,
    });

    const {
        generateReport,
        isLoading: isGeneratingReport,
        isReportGenerated,
        lastGeneratedReportId,
    } = useGenerateSdgReport();

    const reportGenerated = useMemo(() => {
        if (!selectedDataProvider?.id) return false;
        // Check if report was just generated for this provider or if it exists in localStorage
        return lastGeneratedReportId === selectedDataProvider.id || isReportGenerated(selectedDataProvider.id);
    }, [selectedDataProvider?.id, lastGeneratedReportId, isReportGenerated]);

    const handleGenerateReport = () => {
        if (!selectedDataProvider?.id || !user?.email) return;
        generateReport(selectedDataProvider.id, user.email).catch(() => {
            // Error is already handled in the hook/store
        });
    };

    const hasSdgData = sdgYearData?.data?.all?.yearlyData;

    const sdgPapersCount = sdgYearData?.data?.all?.yearlyData
        ? Object.values(sdgYearData.data.all.yearlyData).reduce(
            (sum: number, value: number) => sum + value,
            0
        )
        : 0;

    const { buildPath } = useDashboardRoute();
    const sdgHref = buildPath('sdg');

    // Process SDG data
    const treemapData: TreemapDataItem[] = sdgTypes
        .filter((sdg) => sdg.id !== 'all')
        .map((sdg) => {
            const sdgDataItem = Object.values(sdgYearData?.data || {}).find(
                (data) => data.type === sdg.id
            );
            const outputCount = sdgDataItem?.yearlyData
                ? Object.values(sdgDataItem.yearlyData).reduce(
                    (sum, value) => sum + value,
                    0
                )
                : 0;

            return outputCount > 0
                ? {
                    name: sdg.id,
                    title: sdg.title,
                    size: outputCount,
                    color: sdg.color,
                }
                : null;
        })
        .filter((item): item is TreemapDataItem => item !== null)
        .sort((a, b) => b.size - a.size);

    const renderContent = () => {
        if (sdgYearDataError) {
            return (
                <p className="no-data-message overview-card-error-message">
                    Failed to load SDG data. Please try again later.
                </p>
            );
        }

        if (sdgYearDataLoading || isLoadingOrganisation) {
            return (
                <div className="sdg-data-spinner-wrapper">
                    <Spin indicator={<LoadingOutlined spin />} size="large" />
                    <p className="spinner-text">Loading...</p>
                </div>
            );
        }

        if (isStartingPlan) {
            return (
                <div className="restricted-container">
                    <img src={allSdg} alt="" />
                    <div className="sdg-inner-wrapper">
                        <h5 className="count-header">
                            Number of papers with an SDG label found in your repository:
                        </h5>
                        <div className="sdg-inner-count">{formatNumber(sdgPapersCount)}</div>
                        <Button
                            type="primary"
                            href={sdgHref}
                            className="card-button"
                        >
                            Review
                        </Button>
                    </div>
                </div>
            );
        }

        // No SDG
        if (!hasSdgData) {
            return (
                <div>
                    <Markdown className="generate-text">
                        {sdgTextData.sdgSuggestion.description}
                    </Markdown>
                    {reportGenerated ? (
                        <div className="message-wrapper">{sdgTextData.noSdg.message}</div>
                    ) : (
                        <Button
                            className="start-card-button"
                            type="primary"
                            onClick={handleGenerateReport}
                            loading={isGeneratingReport}
                            disabled={!selectedDataProvider?.id || !user?.email}
                        >
                            {sdgTextData.noSdg.button}
                        </Button>
                    )}
                </div>
            );
        }

        // Default view with treemap
        return (
            <>
                {treemapData.length > 0 ? (
                    <div className="treemap-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <Treemap
                                data={treemapData}
                                dataKey="size"
                                aspectRatio={4 / 3}
                                stroke="#fff"
                                content={CustomContent}
                            >
                                <Tooltip content={<CustomTooltip />} />
                            </Treemap>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="no-data-message">No SDG data available</p>
                )}
                <Button
                    href={sdgHref}
                    className="start-card-button"
                    type="default"
                >
                    {sdgTextData.card.action.title}
                </Button>
            </>
        );
    };

    return (
        <Card
            className="overview-card"
            title={sdgTextData.card.title}
        >
            {renderContent()}
        </Card>
    );
};
