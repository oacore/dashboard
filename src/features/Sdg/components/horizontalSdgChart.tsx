import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import type { LabelProps } from 'recharts';
import "../styles.css";
import { formatNumber } from '@utils/helpers.ts';

interface SdgType {
  id: string;
  title: string;
  name?: string;
  icon: string;
  iconH?: string;
  color: string;
  outputCount: number;
}

interface SdgTypeBase {
  id: string;
  title: string;
  name?: string;
  icon: string;
  iconH?: string;
  color: string;
  outputCount?: number;
}

interface CustomYAxisTickProps {
  x?: string | number;
  y?: string | number;
  data: SdgType[];
  index?: number;
  checkBillingType?: boolean;
}

interface CustomLabelProps {
  x?: string | number;
  y?: string | number;
  width?: string | number;
  value?: string | number;
  totalOutputCount: number;
  toggle: boolean;
  index?: number;
  checkBillingType?: boolean;
}

interface HorizontalChartProps {
  data: SdgType[];
  updatedSdgTypes: SdgType[];
  toggle: boolean;
  sdgTypes?: SdgTypeBase[];
  checkBillingType?: boolean;
}

const CustomYAxisTick = ({ x, y, data, index, checkBillingType }: CustomYAxisTickProps) => {
  if (x === undefined || y === undefined || index === undefined) return null;

  const xNum = typeof x === 'number' ? x : parseFloat(x || '0');
  const yNum = typeof y === 'number' ? y : parseFloat(y || '0');
  if (isNaN(xNum) || isNaN(yNum)) return null;

  const item = data[index];
  const shouldRenderDiv = checkBillingType && ![1, 2, 3].includes(index);

  return (
    <g transform={`translate(${xNum},${yNum})`}>
      <foreignObject x={-210} y={-22} width={190} height={43}>
        {shouldRenderDiv ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#BDBDBD',
            }}
          />
        ) : (
          <div className="icon-wrapper">
            <img src={item.iconH} alt={item.name || item.title} />
          </div>
        )}
      </foreignObject>
    </g>
  );
};

const CustomLabel = ({
  x,
  y,
  width,
  value,
  totalOutputCount,
  toggle,
  index,
  checkBillingType,
}: CustomLabelProps) => {
  if (checkBillingType && index !== undefined && ![1, 2, 3].includes(index)) {
    return null;
  }

  // Convert to numbers and validate
  const xNum = typeof x === 'number' ? x : parseFloat(x || '0');
  const yNum = typeof y === 'number' ? y : parseFloat(y || '0');
  const widthNum = typeof width === 'number' ? width : parseFloat(width || '0');
  const valueNum = typeof value === 'number' ? value : parseFloat(value || '0');

  if (
    isNaN(xNum) ||
    isNaN(yNum) ||
    isNaN(widthNum) ||
    isNaN(valueNum)
  ) {
    return null;
  }

  const labelWidth = valueNum.toString().length * 40;
  const fitsInside = widthNum > labelWidth;
  const displayValue = toggle
    ? `${((valueNum / totalOutputCount) * 100).toFixed(2)}%`
    : formatNumber(valueNum);

  return (
    <g
      transform={`translate(${xNum + (fitsInside ? widthNum - 10 : widthNum + 10)},${yNum + 25
        })`}
    >
      <text
        className="sdg-count-wrapper"
        fill={fitsInside ? '#fff' : '#000'}
        textAnchor={fitsInside ? 'end' : 'start'}
      >
        <tspan>
          <tspan className="sdg-count-h">{displayValue}</tspan>
          <tspan className="sdg-description-h">&nbsp;Papers</tspan>
        </tspan>
      </text>
    </g>
  );
};

const HorizontalChart = ({
  data,
  updatedSdgTypes,
  toggle,
  checkBillingType,
}: HorizontalChartProps) => {
  const filteredData = data.filter((item) => item.id !== 'all' && item.iconH);

  const sortedData = [...filteredData].sort(
    (a, b) => b.outputCount - a.outputCount
  );

  const allSdg = updatedSdgTypes.find((sdg) => sdg.id === 'all');
  const totalOutputCount = allSdg?.outputCount || 0;

  const renderLabel = (props: LabelProps) => {
    const value =
      typeof props.value === 'string' || typeof props.value === 'number'
        ? props.value
        : undefined;
    return (
      <CustomLabel
        x={props.x}
        y={props.y}
        width={props.width}
        value={value}
        index={props.index}
        totalOutputCount={totalOutputCount}
        toggle={toggle}
        checkBillingType={checkBillingType}
      />
    );
  };

  return (
    <ResponsiveContainer width="100%" height={sortedData.length * 50}>
      <BarChart
        layout="vertical"
        data={sortedData}
        margin={{ top: 5, right: 30, left: 165, bottom: 5 }}
        barSize={50}
      >
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'transparent' }}
        />
        <YAxis
          type="category"
          dataKey="title"
          tick={({ x, y, index }) => (
            <CustomYAxisTick
              x={x}
              y={y}
              data={sortedData}
              index={index}
              checkBillingType={checkBillingType}
            />
          )}
          axisLine={false}
          tickLine={false}
        />
        <Bar dataKey="outputCount" fill="#8884d8">
          <LabelList
            dataKey="outputCount"
            content={renderLabel}
          />
          {sortedData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                checkBillingType && ![1, 2, 3].includes(index)
                  ? '#BDBDBD'
                  : entry.color
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HorizontalChart;
