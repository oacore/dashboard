import { Card, Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import InfoTooltip from '@components/common/InfoTooltip';
import { TimeLagChart } from '@features/DepositCompliance/components/TimeLagChart';
import { RegionAlert } from '@features/DepositCompliance/components/RegionAlert';
import Markdown from '@components/common/Markdown/Markdown.tsx';
import { TextData } from '../texts';
import type { DepositTimeLagItem } from '@features/DepositCompliance/hooks/useDepositTimeLag';
import { useDashboardRoute } from '@hooks/useDashboardRoute';
import '../styles.css';

interface DepositingCardProps {
  chartData: DepositTimeLagItem[] | null;
  complianceLevel: number | null;
  dataProviderId: number | undefined;
  countryCode?: string | null;
  isLoading?: boolean;
  error?: boolean;
}

const Loading = () => (
  <div className="sdg-data-spinner-wrapper">
    <Spin indicator={<LoadingOutlined spin />} size="large" />
    <p className="spinner-text">Loading...</p>
  </div>
);

const getDescriptionForDepositingCard = (complianceLevel: number | null): string => {
  const { description } = TextData.depositing;
  let chartDescription: string;

  if (complianceLevel === null || (complianceLevel > 0 && complianceLevel < 100)) {
    const amount = complianceLevel
      ? (100 - complianceLevel).toFixed(2)
      : 'loading...';
    chartDescription = description.complianceLevel.render.replace(
      '{{amount}}',
      amount
    );
  } else if (complianceLevel === 0) {
    chartDescription = description.allNonCompliant.render;
  } else {
    chartDescription = description.allCompliant.render;
  }

  return chartDescription;
};

const filterChartData = (
  data: DepositTimeLagItem[],
  complianceLevel: number = 0.75
): DepositTimeLagItem[] => {
  const dataLimit = 365 * 4;
  const complianceLimit = 90;

  const leftLimit = complianceLimit + Math.floor(dataLimit * complianceLevel) * -1;
  const rightLimit = leftLimit + dataLimit;

  return data.filter(
    (item) =>
      item.depositTimeLag >= leftLimit && item.depositTimeLag <= rightLimit
  );
};

interface ContentProps {
  chartData: DepositTimeLagItem[];
  complianceLevel: number | null;
  dataProviderId: number | undefined;
  countryCode?: string | null;
}

const Content = ({ chartData, complianceLevel, countryCode }: ContentProps) => {
  const { buildPath } = useDashboardRoute();
  if (chartData.length === 0) {
    return <Markdown>{TextData.depositing.description.missingData}</Markdown>;
  }

  return (
    <>
      <div className="depositing-chart">
        <TimeLagChart
          data={filterChartData(chartData, complianceLevel ? complianceLevel / 100 : 0.75)}
          height={200}
        />
      </div>
      <p>{getDescriptionForDepositingCard(complianceLevel)}</p>
      {countryCode?.toLowerCase() !== 'gb' && (
        <RegionAlert>{TextData.depositing.description.regionWarning}</RegionAlert>
      )}
      <Button
        href={buildPath('deposit-compliance')}
        className="start-card-button"
        type="primary"
      >
        {TextData.depositing.action}
      </Button>
    </>
  );
};

export const DepositingCard = ({
  chartData,
  complianceLevel,
  dataProviderId,
  countryCode,
  isLoading = false,
  error = false,
}: DepositingCardProps) => {
  const renderHeader = () => (
    <div className="overview-header-wrapper">
      <h2 className="card-title">{TextData.depositing.title}</h2>
      <InfoTooltip title={TextData.depositing.tooltip} />
    </div>
  );

  const renderCardContent = () => {
    if (error) {
      return (
        <p className="no-data-message overview-card-error-message">
          Failed to load deposit compliance data. Please try again later.
        </p>
      );
    }

    if (isLoading) {
      return <Loading />;
    }

    return (
      <Content
        complianceLevel={complianceLevel}
        chartData={chartData || []}
        dataProviderId={dataProviderId}
        countryCode={countryCode}
      />
    );
  };

  return (
    <Card className="overview-card spread-card" title={renderHeader()}>
      {renderCardContent()}
    </Card>
  );
};
