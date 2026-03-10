import React from 'react';
import {
  BarChart,
  Bar,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
  ResponsiveContainer,
} from 'recharts';
import { Button } from 'antd';
import { CrPaper, InfoTooltip } from '@core/core-ui';
import { formatNumber } from '@utils/helpers';
import type { CrossDepositLagData } from '../hooks/useCrossDepositLag';
import { TextData } from '../texts';
import '../styles.css';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    name?: string;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  return (
    <div className="chart-tooltip">
     <p>count:</p>
      <span className="chart-count">{data.value}</span>
    </div>
  );
};

type ChartDataName = 'Non-Compliant' | 'Result' | 'Compliant';

interface CustomStatisticsChartProps {
  data: Array<{
    name: ChartDataName;
    value: string;
    count: number;
  }>;
  className?: string;
  colors: Record<ChartDataName, string>;
  width?: string | number;
  height?: number;
  labelsPosition?: 'top' | 'inside';
}

const CustomStatisticsChart = ({
  data,
  colors,
  width = '40%',
  height = 230,
  labelsPosition = 'top',
}: CustomStatisticsChartProps) => {
  return (
    <ResponsiveContainer width={width as number | `${number}%`} height={height}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          left: -10,
          right: 0,
          bottom: 0,
        }}
      >
        <YAxis type="number" hide />
        <CartesianGrid strokeDasharray="3 0" vertical={false} stroke="#eee" />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" isAnimationActive={false}>
          {data.map((entry, index) => {
            const color = colors[entry.name] || '#ccc';
            return <Cell key={`cell-${index}`} fill={color} />;
          })}
          <LabelList
            formatter={(value: unknown) => {
              const numValue = typeof value === 'number' ? value : 0;
              return formatNumber(numValue, {
                notation: 'compact',
                maximumFractionDigits: 1,
              }).replace('.', ',');
            }}
            position={labelsPosition === 'inside' ? 'insideTop' : 'top'}
            fill={labelsPosition === 'inside' ? '#fff' : '#222'}
            dataKey="count"
            offset={5}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

interface ContentProps {
  nonCompliantCount: number;
  resultCount: number;
  compliantCount: number;
  exportUrl: string | null;
}

const Content = ({
  nonCompliantCount,
  resultCount,
  compliantCount,
  exportUrl,
}: ContentProps) => {
  const chartData = React.useMemo<Array<{
    name: ChartDataName;
    value: string;
    count: number;
  }>>(
    () => [
      {
        name: 'Non-Compliant',
        value: 'Non-compliant in your repository',
        count: nonCompliantCount,
      },
      {
        name: 'Result',
        value: 'Deposited in other repositories',
        count: resultCount,
      },
      {
        name: 'Compliant',
        value: 'Compliant in other repositories',
        count: compliantCount,
      },
    ],
    [nonCompliantCount, resultCount, compliantCount]
  );

  const colors: Record<ChartDataName, string> = {
    'Non-Compliant': '#B75400',
    'Result': '#F5BB95',
    'Compliant': '#FAE2D2',
  };

  return (
    <div className="cross-wrapper">
      <CustomStatisticsChart data={chartData} colors={colors} />
      <div className="cross-stats">
        {chartData.map(({ name, count, value }) => (
          <div key={name} className="cross-stat-item">
            <div className="cross-stat-indicator" style={{ backgroundColor: colors[name] }} />
            <span>{`${value}: ${formatNumber(count)}`}</span>
          </div>
        ))}
        {resultCount > 0 && exportUrl && (
          <div className="csv-button">
            <Button type="primary" href={exportUrl}>
              {TextData.crossRepositoryCheck?.download || 'Download'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

interface CrossRepositoryCheckCardProps {
  crossDepositLag: CrossDepositLagData | null;
  crossDepositLagCsvUrl: string | null;
  error?: boolean;
}

export const CrossRepositoryCheckCard = ({
  crossDepositLag,
  crossDepositLagCsvUrl,
  error = false,
}: CrossRepositoryCheckCardProps) => {
  const title = TextData.crossRepositoryCheck?.title || TextData.compliance.cross.title;
  const description = TextData.crossRepositoryCheck?.description || TextData.compliance.cross.description;
  const subTitle = TextData.compliance.cross.subTitle;

  return (
    <CrPaper className="compliance-card-inner-wrapper">
      <div id="cross-repository-check" className="number-header-wrapper">
        <h3 className="compliance-card-title">{title}</h3>
        <InfoTooltip title={description} />
      </div>
      {subTitle && (
        <p className="compliance-sub-title">{subTitle}</p>
      )}
      {error && (
        <p className="no-data-message compliance-card-error-message">
          Failed to load cross repository check data. Please try again later.
        </p>
      )}
      {!error && crossDepositLag ? (
        <Content
          nonCompliantCount={crossDepositLag.nonCompliantCount ?? 0}
          resultCount={crossDepositLag.resultCount ?? 0}
          compliantCount={crossDepositLag.bonusCount ?? 0}
          exportUrl={crossDepositLagCsvUrl}
        />
      ) : !error && (
        <div className="loading-placeholder">Loading data...</div>
      )}
    </CrPaper>
  );
};
