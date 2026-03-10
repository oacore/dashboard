import { Card, Button } from 'antd';
import classNames from 'classnames';
import PerformanceChart from '@features/indexing/components/PerformanceChart.tsx';
import { valueOrDefault, getPercent, formatNumber, patchValue } from '@/utils/helpers.ts';
import { articleTemplateData } from '@features/Doi/texts';
import type { DiffStatisticsProps, ChartItem } from '../types.ts';
import { Markdown, InfoTooltip } from '@core/core-ui';
import { useDashboardRoute } from '@hooks/useDashboardRoute';
import '../styles.css';

export type DoiCardProps = {
  doiCount: number;
  outputsCount: number;
  enrichmentSize: number;
  error?: Error | null;
};

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

export const DoiCard = ({
  doiCount,
  outputsCount,
  enrichmentSize,
  error = null,
}: DoiCardProps) => {
  const { title, description, action, cardTooltip } = articleTemplateData.card;

  const chartValues: ChartItem[] = [
    {
      name: 'Outputs have DOI',
      value: valueOrDefault(doiCount, '🔁'),
      color: 'var(--color-primary)',
    },
    {
      name: 'DOIs can be added by CORE',
      value: valueOrDefault(enrichmentSize, '🔁'),
      color: 'var(--color-primary-light)',
    },
    {
      name: 'Outputs without DOI',
      value: valueOrDefault(
        Math.max(0, outputsCount - enrichmentSize - doiCount),
        '0'
      ),
      color: 'var(--color-border)',
    },
  ];

  const renderHeader = () => (
    <div className="overview-header-wrapper">
      <h2 className="card-title">{title}</h2>
      <InfoTooltip title={cardTooltip} ariaLabel={cardTooltip} />
    </div>
  );

  const descriptionText = patchValue(description, {
    count: getPercent(
      enrichmentSize,
      doiCount,
      enrichmentSize ? String(enrichmentSize) : '...'
    ),
  });

  const { buildPath } = useDashboardRoute();
  const doiHref = buildPath('doi');

  const renderCardContent = () => {
    if (error) {
      return (
        <p className="no-data-message overview-card-error-message">
          Failed to load DOI data. Please try again later.
        </p>
      );
    }

    return (
      <div className="doi-card">
        <PerformanceChart
          caption={(
            <DiffStatistics
              outputsCount={outputsCount}
              count={doiCount}
            />
          ) as unknown as string}
          value={valueOrDefault(outputsCount > 0 ? (doiCount / outputsCount) * 100 : undefined, '🔁')}
          className="chart"
          values={chartValues}
          overviewChart
        />
        <div className="doi-card-content">
          {enrichmentSize > 0 && (
            <Markdown>
              {descriptionText}
            </Markdown>
          )}

          <Legend values={chartValues} />
          <div className="doi-card-actions">
            <Button
              type="primary"
              href={doiHref}
              className="doi-card-button"
            >
              {action}
            </Button>
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
