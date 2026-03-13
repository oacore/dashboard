import {
  AreaChart as RechartAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { formatNumber } from '@/utils/helpers';
import '../styles.css';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    payload?: Record<string, unknown>;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  const label = data?.name ?? 'Metadata count';
  const value = data?.value ?? data?.payload?.[label];

  return (
    <div className="chart-tooltip info-card-tooltip">
      <p className="tooltip-title">{label}</p>
      <p className="tooltip-count">
        {typeof value === 'number'
          ? formatNumber(value, { notation: 'compact', maximumFractionDigits: 2 })
          : String(value ?? '')}
      </p>
    </div>
  );
};

interface AreaChartProps {
  data: Array<Record<string, string | number>>;
  className?: string;
  chartColor?: string;
  lineColor?: string;
  width?: string | number;
  height?: number;
  domain?: [string | number, string | number];
  labelsPosition?: 'top' | 'inside';
  [key: string]: unknown;
}

const COLORS = {
  primary: 'var(--color-primary, #EF8237)',
  gray200: 'var(--color-border, #d9d9d9)',
};

const AreaChart = ({
  data,
  className,
  chartColor = COLORS.primary,
  lineColor = chartColor,
  width = '100%',
  height = 230,
  labelsPosition = 'top',
  ...restProps
}: AreaChartProps) => {
  if (!data || data.length === 0) return null;

  const firstItem = data[0];
  const barKeys = Object.keys(firstItem).filter((key) => key !== 'name');

  return (
    <ResponsiveContainer width={width as number | `${number}%`} height={height}>
      <RechartAreaChart
        data={data}
        className={className}
        margin={{
          top: 30,
          right: 30,
          left: 30,
          bottom: 0,
        }}
        {...restProps}
      >
        <defs>
          <linearGradient id="area-chart-color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartColor} stopOpacity={0.9} />
            <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 0" vertical={false} stroke="#eee" />
        <XAxis type="category" axisLine={false} dataKey="name" />
        <YAxis type="number" hide domain={['dataMin', 'dataMax']} />
        <Tooltip cursor={false} content={<CustomTooltip />} />
        {barKeys.map((dataKey, index) => (
          <Area
            key={dataKey}
            isAnimationActive={false}
            type="monotone"
            fill="url(#area-chart-color)"
            dataKey={dataKey}
            stroke={lineColor}
            fillOpacity={1}
            activeDot={{ r: 4 }}
            dot
          >
            {index === barKeys.length - 1 ? (
              <LabelList
                position={labelsPosition}
                offset={10}
                formatter={(value: unknown) =>
                  typeof value === 'number'
                    ? formatNumber(value, {
                      notation: 'compact',
                      maximumFractionDigits: 2,
                    })
                    : String(value ?? '')
                }
                fill={labelsPosition === 'inside' ? '#fff' : '#222'}
                dataKey={dataKey}
              />
            ) : null}
          </Area>
        ))}
      </RechartAreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChart;
