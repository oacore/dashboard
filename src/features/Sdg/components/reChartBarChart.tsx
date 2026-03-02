import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from 'recharts'
import "../styles.css"

import { formatNumber } from '@utils/helpers.ts';
import { useDataProviderStore } from '@/store/dataProviderStore';

interface SdgType {
  id: string;
  title: string;
  icon: string;
  iconH?: string;
  color: string;
  outputCount?: number;
}

interface ReChartBarChartProps {
  sdgTypes: SdgType[];
  updatedSdgTypes: SdgType[];
  data: Array<Record<string, string | number>>;
  sdgYearDataLoading: boolean;
  visibleColumns: string[];
  toggle: boolean;
}

interface TooltipPayload {
  value: number;
  color: string;
  name: string;
  dataKey: string;
}

interface TooltipProps {
  payload?: readonly TooltipPayload[];
  label?: string | number;
}

const ReChartBarChart = ({
  sdgTypes,
  updatedSdgTypes,
  data,
  sdgYearDataLoading,
  visibleColumns,
  toggle,
}: ReChartBarChartProps) => {
  const { statistics } = useDataProviderStore();
  const allSdg = updatedSdgTypes.find((sdg) => sdg.id === 'all');
  const totalOutputCount = allSdg?.outputCount || 0;

  const formatLabel = (value: string | number | boolean | null | undefined): string => {
    if (typeof value !== 'number') return '';
    if (toggle) return `${((value / totalOutputCount) * 100).toFixed(2)}%`;
    return formatNumber(value);
  };

  const renderTooltip = ({ payload, label }: TooltipProps) => {
    if (!payload || !payload.length) return null;

    const countMetadata = statistics?.countMetadata || 1;

    return (
      <div className="bar-tooltip">
        <p>{label}</p>
        {payload.map((entry, index) => {
          const { value, color, name } = entry;
          if (toggle) {
            const firstPercentage = (
              (value / countMetadata) *
              100
            ).toFixed(2);
            const secondPercentage = ((value / totalOutputCount) * 100).toFixed(
              2
            );
            return (
              <p key={`item-${index}`} style={{ color }}>
                {firstPercentage}% of all papers belong to {name}
                <br />
                {secondPercentage}% of papers with an SDG label belong to{' '}
                {name}
              </p>
            );
          }
          return (
            <p key={`item-${index}`} style={{ color }}>
              {name}: {formatNumber(value)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="chart-wrapper">
      <div className="inner-chart-wrapper">
        <div style={{ width: '100%', height: 400 }}>
          {sdgYearDataLoading ? (
            <div className="loading-bar-container">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="loading-bar" />
              ))}
            </div>
          ) : (
            <ResponsiveContainer>
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={renderTooltip} />
                <Legend />
                {sdgTypes
                  .filter((sdg) => visibleColumns.includes(sdg.id))
                  .map((sdg) => (
                    <Bar key={sdg.id} dataKey={sdg.id} fill={sdg.color}>
                      <LabelList
                        dataKey={sdg.id}
                        position="top"
                        formatter={formatLabel}
                      />
                    </Bar>
                  ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReChartBarChart;
