import { Card, Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import PerformanceChart from '@features/indexing/components/PerformanceChart.tsx';
import { valueOrDefault, getPercent, formatNumber } from '@/utils/helpers.ts';
import { TextData as OrcidTextData } from '@features/Orcid/texts';
import type { OrcidCardProps, DiffStatisticsProps, ChartItem } from '../types.ts';
import '../styles.css';
import InfoTooltip from '@components/common/InfoTooltip';
import { useBillingPlanData } from '@features/Orcid/hooks/useBillingPlanData.ts';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';
import { useDashboardRoute } from '@hooks/useDashboardRoute';

const DiffStatistics = ({ outputsCount, count }: DiffStatisticsProps) => {
  if (!outputsCount) {
    return (
      <span className="statistics">
        Loading...
      </span>
    );
  }

  const countValue = valueOrDefault(count ?? undefined, '🔁');
  const safeCount = typeof countValue === 'number' ? countValue : 0;

  return (
    <span className="statistics">
      {formatNumber(safeCount, { notation: 'compact' })} out of{' '}
      {formatNumber(outputsCount, { notation: 'compact' })}
    </span>
  );
};

type LegendProps = {
  values: ChartItem[];
  className?: string;
};

const Legend = ({ values, className }: LegendProps) => (
  <div className={classNames('legends', className)}>
    {values.map((entry) => (
      <div className="legend" key={entry.name}>
        <i className="box" style={{ backgroundColor: entry.color }} />
        <span className="legends-caption">{entry.name}</span>
      </div>
    ))}
  </div>
);

export const OrcidCard = ({
  count,
  outputsCount,
  enrichmentSize,
  onDownloadCsv,
  showInfo = false,
  error = null,
}: OrcidCardProps) => {
  const { organisation, isLoadingOrganisation } = useOrganisation();
  const { isStartingPlan } = useBillingPlanData([] as never[], organisation);
  const { buildPath } = useDashboardRoute();
  const orcidHref = buildPath('orcid');

  const chartValues: ChartItem[] = [
    {
      name: 'Outputs have at least one ORCID',
      value: valueOrDefault(count, '🔁'),
      color: 'var(--success-dark)',
    },
    {
      name: 'Discovered ORCID enrichments',
      value: valueOrDefault(enrichmentSize, '🔁'),
      color: 'var(--success)',
    },
    {
      name: 'Outputs without ORCID',
      value: valueOrDefault(outputsCount - enrichmentSize - count, '0'),
      color: 'var(--color-border)',
    },
  ];

  const renderHeader = () => (
    <div className="header-wrapper">
      <h2 className="card-title">{OrcidTextData.orcidCard.title}</h2>
      {showInfo && <InfoTooltip title="test" />}
    </div>
  )

  const renderCardContent = () => {
    if (error) {
      return (
        <p className="no-data-message overview-card-error-message">
          Failed to load ORCID data. Please try again later.
        </p>
      );
    }

    if (isLoadingOrganisation) {
      return (
        <div className="sdg-data-spinner-wrapper">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
          <p className="spinner-text">Loading...</p>
        </div>
      );
    }

    return (
      <div className="doi-card">
        <PerformanceChart
          caption={(
            <DiffStatistics
              outputsCount={outputsCount}
              count={count}
            />
          ) as unknown as string}
          value={valueOrDefault((count / outputsCount) * 100, '🔁')}
          className="chart"
          values={chartValues}
          overviewChart
        />
        <div className="doi-card-content">
          <div>
            We can enrich your ORCID coverage by{' '}
            <b>{getPercent(enrichmentSize, count, enrichmentSize ? String(enrichmentSize) : '...')}</b>. Download your CSV below.
          </div>
          <Legend values={chartValues} />
          <div className="doi-card-actions">
            {isStartingPlan ? (
              <Button
                type="primary"
                href={orcidHref}
                className="doi-card-button"
              >
                Details
              </Button>
            ) : (
              <>
                <Button
                  type="text"
                  href={orcidHref}
                  className="doi-card-button"
                >
                  {OrcidTextData.orcidCard.actions[0].title}
                </Button>
                <Button
                  className="doi-card-button"
                  type="primary"
                  onClick={onDownloadCsv}
                  disabled={!onDownloadCsv}
                >
                  {OrcidTextData.orcidCard.actions[1].title}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card
      className="overview-card"
      title={renderHeader()}
    >
      {renderCardContent()}
    </Card>
  );
};
